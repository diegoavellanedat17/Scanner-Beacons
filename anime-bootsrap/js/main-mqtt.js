//Crear un cliente mqtt
//client = new Paho.MQTT.Client("5d8432f97d634e1cbc3d3c9b14887330.s1.eu.hivemq.cloud", 3883,"web_" + parseInt(Math.random() * 100, 10));

client = new Paho.MQTT.Client(options.host, Number(8084), "webpage");
console.log(client)
// set callback handlers
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

var options = {
    useSSL: true,
    userName: options.username,
    password: options.password,
    onSuccess:onConnect,
    onFailure:doFail
  }
// connect the client

client.connect(options);

  // called when the client connects
  function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log("onConnect");
    // Suscribirse a los dispositivos que tengo 
    stations.forEach(function(station){
        console.log(` suscribiendose a /${station}/#`)
        client.subscribe(`/${station}/#`);
    })
    
    // message = new Paho.MQTT.Message("Hello From Browser");
    // message.destinationName = "/webBrowser";
    // client.send(message);
  }

  function doFail(e){
    console.log(e);
  }

  // called when the client loses its connection
  function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
      console.log("onConnectionLost:"+responseObject.errorMessage);
    }
  }

  // called when a message arrives
  function onMessageArrived(message) {
    // Se extrae de que topico es la bateria 
    var topic=message.destinationName
    var message=message.payloadString;
    //var integer = parseInt(message, 10);

    if(topic.includes('status')){
        handle_status(topic,message)
    }
    console.log("onMessageArrived:"+message);
    //console.log(integer)

  }

//Animacion
  animationStatus= anime({
    targets :'.status',
    scale:'0.7',
    duration: 800,
    backgroundColor: '#198754',
    easing: 'easeOutElastic(1, .2)',
    loop: true,
    autoplay: false,
})

function handle_status(topic,message){

    var deviceTopics= topic.split('/');
    device=deviceTopics[1]
    console.log(device)

    console.log(message)

    if(message==='ON'){
        $( ".status" ).css("background-color","#65ed80");
        console.log("conectado")
        animationStatus.play()
    }
    else{
        console.log("desconectado")
        animationStatus.restart()
        animationStatus.pause()
        $( ".status" ).css("background-color","#c8d0e7");
    }


    

}