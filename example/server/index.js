var https = require('https');
var fs = require("fs");
var WebSocketServer = require('ws').Server;

var wsPort = 5000;
var masterId;
var listeners = {};

var httpsServer = https.createServer({
    key: fs.readFileSync('key.pem', 'utf8'),
    cert: fs.readFileSync('cert.pem', 'utf8')
}).listen(wsPort);

var wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function (ws, req) {
    var connectionId = req.headers['sec-websocket-key'];
    var isMaster = false;

    if (!masterId) {
        masterId = connectionId;
        isMaster = true;
        ws.on('message', function (message) {
            for (var cid in listeners) {
                listeners[cid].send(message, {
                    binary: true
                }, function (err) {
                    if (err) {
                        console.log('Error: ', err);
                    }
                });
            }
        });
        console.log('Speaker connected');
    } else {
        listeners[connectionId] = ws;
        isMaster = false;
        console.log('Listener connected');
    }

    ws.on('close', function () {
       if (isMaster) {
           masterId = null;
           console.log('Speaker disconnected');
       } else {
           delete listeners[connectionId];
           console.log('Listener disconnected');
       }
    });
});

console.log('Listening on port:', wsPort);
