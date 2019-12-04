# Server and simple vanila JS frontend for controling a Tello Drone

## Installation
I'm using python 3 (python 2 might work though) and Mac OS X. For the video streaming you'll need to install ffmpeg:

To install python run
```
brew install python3
brew postinstall python3
```

For camera recording capabilities install these:
```
pip3 install ffmpeg-python
brew install ffmpeg
```

(where brew is Homebrew, [https://brew.sh/](https://brew.sh/), and pip3 might need to be pip, depending on what your python 3 pip is called).

## Running

1. Turn the drone on
2. Connect your laptop to the drone WiFi
3. Run the python server with `python3 TelloServer.py`
4. Open the frontend in your browser [`open ./complete/index.html`](https://github.com/jacoblever/tello-drone-controller/blob/master/complete/index.html) to check out the completed example of the drone controller UI with simulator
