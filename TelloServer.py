import ffmpeg
import threading 
import socket
import sys
import time
import platform
import http.server
import socketserver
import urllib.parse
import queue
import os
import json
from datetime import datetime

tello_address = ('192.168.10.1', 8889)

host = ''
port = 9000
commands_address = (host, port)
stats_address = ('', 8890)
video_address = 'udp://0.0.0.0:11111'

WEB_SERVER_PORT = 8080

# Becasue we are talking to the drone over sockets, rather than something highlevel like
# HTTP, we use this queue to respond to the frontend with the response the drone gave us
# for each command issued
response_queue = queue.Queue()

# As the drone streams stats to us, we store them in this dictionary, we can then serve them to
# the frontend whenever they call the /stats endpoint
stats = {}

def is_connected_to_drone():
    get_wifi_SSID = "/System/Library/PrivateFrameworks/Apple80211.framework/Resources/airport -I | awk -F: '/ SSID/{print $2}'"
    wifi_name = os.popen(get_wifi_SSID).read()
    return wifi_name.__contains__("TELLO")

socketForCommands = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socketForCommands.bind(commands_address)
def read_from_drone():
    while True: 
        try:
            data, server = socketForCommands.recvfrom(1518)
            message = data.decode(encoding="utf-8")
            response_queue.put(message)
            print("Recieved: {}".format(message))
        except Exception as e:
            print('\nError reading from socket')
            print(e)
            break
threading.Thread(target=read_from_drone).start()

socketForStats = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socketForStats.bind(stats_address)
def read_stats():
    while True: 
        try:
            data, server = socketForStats.recvfrom(1518)
            message = data.decode(encoding="utf-8")
            for stat in message.split(';'):
                if not stat.__contains__(':'):
                    continue
                bits = stat.split(':')
                stats[bits[0]] = bits[1]
        except Exception as e:
            print('\nError reading from stats')
            print(e)
            break
threading.Thread(target=read_stats).start()

def record_video():
    try:
        now = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        # for this to work you need 'pip install ffmpeg-python' and 'brew install ffmpeg'
        recorder = ffmpeg.input(video_address, t=30).output('drone-{}.mp4'.format(now))
        recorder.run()
    except Exception as e:
        print("Error receiving video: " + str(e))

def send_command(msg):
    if not is_connected_to_drone():
        print("Not connected to Drone WiFi")
        return "Drone offline"
    print("Sending: {}".format(msg))
    encoded = msg.encode(encoding="utf-8")

    # Might get "OSError: [Errno 51] Network is unreachable" if the drone is off
    # Although this is made less likely by the WiFi check above
    socketForCommands.sendto(encoded, tello_address)

    # This will block until the drone responds with a message and there's something to get from the queue
    return response_queue.get()

class DroneServerHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/start':
            resp = send_command('command')
            response = 'Command sent: "{}", drone responded: "{}"'.format('command', resp)
        elif self.path == '/end':
            close_sockets()
            response = 'Ended'
        elif self.path == '/streamon':
            resp = send_command('streamon')
            videoThread = threading.Thread(target=record_video)
            videoThread.daemon = True
            videoThread.start()
            response = 'Command sent: "{}", drone responded: "{}"'.format('streamon', resp)
        elif self.path == '/stats':
            if is_connected_to_drone():
                self.respond_with_200(json.dumps(stats))
            else:
                self.respond_with_200("Drone offline")
            return
        else:
            msg = urllib.parse.unquote(self.path[1:])
            resp = send_command(msg)
            response = 'Command sent: "{}", drone responded: "{}"'.format(msg, resp)
        self.respond_with_200(response)

    def respond_with_200(self, body):
        self.send_response(200)
        self.send_header("Content-type", "text/html")
        self.send_header("Content-length", len(body))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(str.encode(body))


def close_sockets():
    print('\nClosing sockets...')
    socketForCommands.close()
    socketForStats.close()


# Start main program

if not is_connected_to_drone():
    print("WARNING: Not connected to Drone WiFi")

with socketserver.TCPServer(("", WEB_SERVER_PORT), DroneServerHandler) as httpd:
    try:
        print("serving at port", WEB_SERVER_PORT)
        httpd.serve_forever()
    except KeyboardInterrupt:
        close_sockets()
