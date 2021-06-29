var mqtt = require('mqtt')
var CONFIG = require('./config.json');
var options = {
    host: CONFIG.host,
    port: CONFIG.port,
    clientId: CONFIG.clientId,
    protocol: CONFIG.protocol,
    username: CONFIG.username,
    password: CONFIG.password
}

//initialize the MQTT client
var client = mqtt.connect(options);

//setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('/#');

// publish message 'Hello' to topic 'my/test/topic'
client.publish('/tema', 'Hello');