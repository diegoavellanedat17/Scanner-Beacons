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
function defineAnimation(){

  animationStatus= anime({
    targets :'.status-on',
    scale:'0.7',
    duration: 800,
    backgroundColor: '#198754',
    easing: 'easeOutElastic(1, .2)',
    loop: true,
    autoplay: true,
  })

  wave1 = anime({
    targets:'.circle__back-1-on',
    keyframes: [
        {scale: 2, opacity: 1, duration:700},
        {scale: 4, opacity: 1, duration:700},
        {scale: 8, opacity: 0, duration:1000},
 
      ],
    easing: 'linear',
    loop: true,
    autoplay:true
 });

 wave2 = anime({
    targets:'.circle__back-2-on',
    keyframes: [
        {scale: 1, opacity: 1, duration:700},
        {scale: 3, opacity: 1, duration:700},
        {scale: 6, opacity: 0, duration:1000},

      ],
    easing: 'easeInOutExpo',
    loop: true,
    autoplay:true
  });

    
}


var functions_anime=[]
var functions_wave1=[]
var functions_wave2=[]

function handle_status(topic,message){

    var deviceTopics= topic.split('/');
    device=deviceTopics[1]
    console.log(device)

    console.log(message)

    if(message==='ON'){
      console.log("conectado")

        $(".status",`#disp-${device}`).css("background-color","#65ed80");

        //$(".status",`#disp-${device}`).addClass( "status-on" );

        var element=document.getElementById(`status-${device}`)
        var element_wave1=document.getElementById(`circle__back-1-${device}`)
        var element_wave2=document.getElementById(`circle__back-2-${device}`)

        $(".icon-zaboo",`#${device}`).css("color","#6610f2");
  
        //Guardar en un arreglo las animaciones correspondientes 
      
        functions_anime.push(anime({
              targets:element,
              scale:'0.7',
              duration: 800,
              backgroundColor: '#198754',
              easing: 'easeOutElastic(1, .2)',
              loop: true,
              autoplay: true,
            }))
            
        if(element_wave1 !== null && element_wave2 !== null){
              functions_wave1.push(anime({
                targets:element_wave1,
                keyframes: [
                    {scale: 2, opacity: 1, duration:700},
                    {scale: 4, opacity: 1, duration:700},
                    {scale: 8, opacity: 0, duration:1000},
            
                  ],
                easing: 'linear',
                loop: true,
                autoplay:true
            }))

            functions_wave2.push(anime({
              targets:element_wave2,
              keyframes: [
                  {scale: 1, opacity: 1, duration:700},
                  {scale: 3, opacity: 1, duration:700},
                  {scale: 6, opacity: 0, duration:1000},
          
                ],
              easing: 'easeInOutExpo',
              loop: true,
              autoplay:true
            }))

        }

            

    }
    else{

        console.log("desconectado")


        functions_anime.forEach(function(item_to_delete,index,object){

          if( item_to_delete.animatables[0].target.id === `status-${device}`){
            console.log('pausando')
            $(".status",`#disp-${device}`).css("background-color","#c8d0e7");
            $(".icon-zaboo",`#${device}`).css("color","#6c757d");
            item_to_delete.pause()
            object.splice(index, 1);
          }

        })

        functions_wave1.forEach(function(item_to_delete,index,object){

          if( item_to_delete.animatables[0].target.id === `circle__back-1-${device}`){
            console.log('pausando')
            item_to_delete.restart()
            item_to_delete.pause()
            
            object.splice(index, 1);
          }

        })

        functions_wave2.forEach(function(item_to_delete,index,object){

          if( item_to_delete.animatables[0].target.id === `circle__back-2-${device}`){
            console.log('pausando')
            item_to_delete.restart()
            item_to_delete.pause()   
            object.splice(index, 1);
          }

        })
             
    }




}

function addStation(id){
  $("body").append(`

    <div class="station" id="${id}" title="${id}">
            <span class="station__btn" >
                <ion-icon class="icon-zaboo" name="pause">B</ion-icon>
                <ion-icon class="play" name="play"></ion-icon>
              </span>
              <span class="circle__back-1" id="circle__back-1-${id}"></span>
              <span class="circle__back-2" id="circle__back-2-${id}"></span>
        </div>
    
        `)

      //Comprobar si la renderizo activa o inactiva
  console.log(functions_wave1)
  console.log(functions_wave2)
      renderActiveOrInactive(id)
}

function renderActiveOrInactive(id){

  functions_anime.forEach(function(item_to_animate,index,object){
    //si existe quiere decir que tiene que salir animada

    if( item_to_animate.animatables[0].target.id === `status-${id}`){


      $(".icon-zaboo",`#${device}`).css("color","#6610f2");
      
      var element_wave1=document.getElementById(`circle__back-1-${id}`)
      var element_wave2=document.getElementById(`circle__back-2-${id}`)

      functions_wave1.push(anime({
          targets:element_wave1,
          keyframes: [
              {scale: 2, opacity: 1, duration:700},
              {scale: 4, opacity: 1, duration:700},
              {scale: 8, opacity: 0, duration:1000},
      
            ],
          easing: 'linear',
          loop: true,
          autoplay:true
      }))

      functions_wave2.push(anime({
        targets:element_wave2,
        keyframes: [
            {scale: 1, opacity: 1, duration:700},
            {scale: 3, opacity: 1, duration:700},
            {scale: 6, opacity: 0, duration:1000},
    
          ],
        easing: 'easeInOutExpo',
        loop: true,
        autoplay:true
      }))

    }

  })

}