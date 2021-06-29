
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
    client.subscribe("/#");
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
    var integer = parseInt(message, 10);

    console.log("onMessageArrived:"+message);
    console.log(integer)
    if(topic==='/bateria'){
      //$( ".battery" ).append(message.payloadString);
      
      $( ".battery" ).css({"box-shadow": `inset ${integer}px 0px 0px #fff`});
      if (integer < 4){
        $( ".battery" ).css({"border": "1px red solid"});
        $( ".battery:after" ).css({"background-color": "red"});
        
      }
      else{
        $( ".battery" ).css({"border": "1px #fff solid"});
        $( ".battery:after" ).css({"background-color": "#fff"});

      }
    }


  }
