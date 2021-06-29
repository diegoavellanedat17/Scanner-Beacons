const express = require('express')
const app = express()
const port = 3000
//Ruta de archivos donde se encuentran los estaticos
app.use(express.json({limit:'1mb'}));
//app.use('./static', express.static(__dirname + '/public'));
app.use(express.static(__dirname + "/public"));
// El path para definir la ruta
var path = require('path');
// Para importar el modulo de mqtt
var mqtt=require('mqtt');
//host del broker
const host="5d8432f97d634e1cbc3d3c9b14887330.s1.eu.hivemq.cloud"

options={
    host: '5d8432f97d634e1cbc3d3c9b14887330.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'diegoavellanedat',
    password: 'Df930917061207'
};

var client = mqtt.connect(options)

//Cuando se conecte el backend
client.on("connect",function(){	
    console.log("connected  "+client.connected);
})

//Cuando exista un error
client.on('error', function (error) {
    console.log(error);
});

//Cuando recibamos un mensaje
client.on('message', function (topic, message) {
    //Called each time a message is received
    console.log('Received message:', topic, message.toString());
    //hacer update al front
    app.post('/', function (req, res) {
        res.send('POST request to the homepage');
        res.json({
            status:'success'
        })
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// suscribirse a todo
client.subscribe('#');