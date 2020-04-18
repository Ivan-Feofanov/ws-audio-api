WebSocket Audio API
====================
####Library to broadcast the sound from the microphone through a WebSocket

This library can work in two ways:  

**Streamer mode**:  
  1.  Get user audio from microphone (**getUserMedia support require**)  
  2.  Encode it with Opus codec  
  3.  Send it to websocket server  

Works fine in Chrome, Firefox, Edge. Doesn't work in Safari.  

**Player mode**:  
  1.  Get packet from broadcasting server  
  2.  Decode it with Opus codec  
  3.  Write it to audio queue  
  4.  Play audio queue (**Web Audio Api support require**)  

Works fine in all browsers  

 For Speaker only:
 In Chrome browser you should use secure connection cause Chrome does not support getUserMedia in unsecure HTTP connection  
 [How to setup secure HTTP server](https://docs.nodejitsu.com/articles/HTTP/servers/how-to-create-a-HTTPS-server) 

Bower
-----
```bash
$ bower install ws-audio-api
```

NPM
-----
```bash
$ npm install ws-audio-api
```

```js
$ import 'ws-audio-api'
```

Quick start
-----------
0. Clone this repository  
    ```bash
    $ git clone https://github.com/Ivan-Feofanov/ws-audio-api.git
    $ cd ws-audio-api
    $ npm i
    $ cd ws-audio-api/example
    ```

1. Start secure websockets server from **server** folder
    ```bash
    $ cd server && npm i
    $ npm start
    ```
    This command will start broadcasting server on port 5000

2. Include scripts in both, speaker and listener page
    ```js
    <script src="scripts/ws-audio-api.min.js"></script>
    ```

3. On Streamer side create new speaker and make start/stop stream buttons
    ```js
    <script>
        var streamer = new WSAudioAPI.Streamer({
            server: {
                host: window.location.hostname, //websockets server addres. In this example - localhost
                port: 5000 //websockets server port
        });
    </script>
    
    <button onclick="streamer.start()">Start stream</button>
    <button onclick="streamer.stop()">Stop stream</button>
    ```
    *Detailed config description placed below*

4. On listener side create new listener and make play/stop buttons
    ```js
    <script>
        var player = new WSAudioAPI.Player({
            server: {
                host: window.location.hostname, //websockets server addres. In this example - localhost
                port: 5000 //websockets server port
        });
    </script>
    <button onclick="player.start()">Play stream</button>
    <button onclick="player.stop()">Stop playing</button>
    ```

5. **Enjoy!**

Config
------

#### Default config
```js
var defaultConfig = { 
    codec: {
        sampleRate: 24000,
        channels: 1,
        app: 2048,
        frameDuration: 20,
        bufferSize: 4096
    },
    server: {
        host: window.location.hostname,
        port: 5000
    }
}
```

You can change any parameter to fine tune your broadcast.  
**!! Codec settings on both streamer and listener side should be the same !!**  
I recommend use sample rate 24000 and below to avoid gaps in stream  

#### Opus Quality Settings

App: 2048=voip, 2049=audio, 2051=low-delay  
Sample Rate: 8000, 12000, 16000, 24000, or 48000  
Frame Duration: 2.5, 5, 10, 20, 40, 60  
Buffer Size = sample rate/6000 * 1024  

Server-side
-----------
Server side script is very simple:  
You can use this script for setup standalone broadcasting server or add ws-audio broadcast functionality to your own server.

API
---

### Streamer

Create new streamer:
```js
var streamer = new WSAudioAPI.Streamer(config);
```

Start stream
```js
streamer.start();
```

Mute microphone
```js
streamer.mute();
```

Unmute microphone
```js
streamer.unMute();
```

Stop stream
```js
streamer.stop();
```

### Player

Create new player
```js
var player = new WSAudioAPI.Player(config);
```

Play stream
```js
player.start();
```

Get stream volume
```js
player.getVolume();
```

Change stream volume
```js
player.setVolume(level); //Float 0.00 - 1.00
```

Volume control example
```html
<input id="volume" type="range" min ="0.0" max="1.0" step ="0.01" oninput="setVol(this.value)" oninput="setVol(this.value)" style="-webkit-appearance: slider-vertical">
<input type="text" id="volumeIndicator">
```
```js
var volume = document.querySelector('#volume');
var volumeIndicator = document.querySelector('#volumeIndicator');
volumeIndicator.value = player.getVolume();

function setVol(val){
    player.setVolume(val);
    volumeIndicator.value = player.getVolume();
}
```

Stop playing
```js
player.stop();
```

## People
USM LLC.  
With regards to
  * [Kazuki Oikawa](https://github.com/kazuki/opus.js-sample/)
  * [F1LT3R](https://github.com/F1LT3R/voip-js)


## License

  [MIT](LICENSE)
