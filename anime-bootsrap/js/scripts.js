

//https://codepen.io/Ben_Tran/pen/YYYwNL

// Mostrar los dispositivos que se tienen
ShowComponents()

function ShowComponents(){
  stations.forEach(function(element){

    $(`#kit-items`).append(`

            <div class=" col-2  square-components" >
                <div class=" kit-components" onmousedown="mouseDown()" onmouseup="mouseUp()">

                    <div class="top-icon" >
                        <i class="material-icons " style="font-size:13px; position:relative;">sensors</i>   
                    </div>

                    <div class="element-name" >
                      <p style="font-size: 6px; color: grey;">${element}</p>
                    </div>

                    <div class="row">

                      <div class="col-6 nombre-nivel" >
                        <p id ="p-station"style="font-size: 6px; color: grey;">Batt: </p>
                      </div>

                      <div class="col-6 nombre-icon" >
                        <div class="battery">
                            <div class="battery-level"></div>
                        </div>
                      </div>

                      <div class="col-6 nombre-nivel" >
                        <p id ="p-station"style="font-size: 6px; color: grey;">Estado: </p>
                      </div>

                      <div class="col-6 nombre-icon" >
                        <div class="status">
                        </div>
                      </div>

                      

                    
                    </div>




                </div>
            </div>
      `
        )

  })

  
}

function beaconLimits(x,y){
  anime({
    targets:'.beacon',
    keyframes: [
      
      {translateX: x,
        duration: 1000
      },
      {translateY: y,
      duration: 1000,},
      {translateX: 0,
      duration: 1000,},
      {translateY: 0,
      duration: 1000},
      
    ],
    //duration: 6000,
    easing: 'easeOutElastic(1, .8)',
    loop: true,
    
});
}

function CreateWaves(){
   wave1 = anime({
    targets:'.circle__back-1',
    keyframes: [
        {scale: 2, opacity: 1, duration:700},
        {scale: 4, opacity: 1, duration:700},
        {scale: 8, opacity: 0, duration:1000},

      ],
    easing: 'linear',
    loop: true,
    autoplay:false
});

 wave2 = anime({
    targets:'.circle__back-2',
    keyframes: [
        {scale: 1, opacity: 1, duration:700},
        {scale: 3, opacity: 1, duration:700},
        {scale: 6, opacity: 0, duration:1000},

      ],
    easing: 'easeInOutExpo',
    loop: true,
    autoplay:false
});

var clicked=false;
return clicked;
}

$( "body" ).on('click','.station__btn',function() {
    clicked= CreateWaves()
    if (clicked){
        wave1.restart();
        wave2.restart();
        wave1.pause();
        wave2.pause();
        clicked=false;
        $( ".icon-zaboo" ).css("color","#808089");

    }
    else{
        wave1.play();
        wave2.play();
        clicked=true;
        $( ".icon-zaboo" ).css("color","#5b0eeb");
    }


});

//Ubicar la estación 
function placeDiv(x_pos, y_pos,id) {
    // var d = document.getElementById('zaboo-station');
    // d.style.position = "absolute";
    // d.style.left = x_pos+'px';
    // d.style.top = y_pos+'px';
    $(`#${id}`).css("left",`${x_pos}px`)
    $(`#${id}`).css("top",`${y_pos}px`)
}
//Ubicar un limite para los beacons

function placeLimiter(x_pos, y_pos,width,height) {
  var d = document.getElementById('placeLimiter');
  d.style.left = x_pos+'px';
  d.style.top = y_pos+'px';
  d.style.width=width+'px';
  d.style.height=height+'px';
  
}

function placeBeacon(x_pos, y_pos,maxX,maxY) {
   var d = document.getElementById('zaboo-beacon');
   d.style.position = "absolute";
   d.style.left = x_pos+'px';
   d.style.top = y_pos+'px';
   beaconLimits(maxX,maxY)
   
 }

// Aqui pondre los contructores de cavas editable
const canvas= new fabric.Canvas('canvas',{
    width:300,
    height:150,
    backgroundColor:'#e4ebf5',
    selection:false,
    
})
if(window.innerWidth>780){
  canvas.setWidth(400);
}
else if(window.innerWidth>440){
  canvas.setWidth(300);
}
else{
  canvas.setWidth(200);
}
canvas.renderAll()

// Aqui pondre los contructores de cavas estatico
const canvasStatic= new fabric.StaticCanvas('canvas-static',{
  width:400,
  height:150,
  backgroundColor:'#e4ebf5',
  selection:false
})
canvasStatic.renderAll()

canvas.on('mouse:wheel', function(opt) {
  var delta = opt.e.deltaY;
  var zoom = canvas.getZoom();
  zoom *= 0.999 ** delta;
  if (zoom > 20) zoom = 20;
  if (zoom < 0.01) zoom = 0.01;
  canvas.setZoom(zoom);
  opt.e.preventDefault();
  opt.e.stopPropagation();
})

$("#save").click(function(){
    console.log("guardar canvas")
    //canvas save es lo que haya en el canvas hasta ese punto se guarda
    var canvas_save= JSON.stringify(canvas);

    //renderizar en el otro otro canvas
    renderStaticCanvas(canvas_save)

})

$("#remove").click(function(){
  console.log("borrar")
  deleteObjects()
})
  

// Agregar titulo al gráfico, esto muestra un un searchbox y un botón 
var titleBool=false;
$("#add-title").click(function(){
  if(!titleBool){
    console.log("agregar título")
    $("#section-title").css("display","block");
    anime({
      targets: '#section-title',        
      opacity: '1',
      duration: 1000,
      easing: 'easeInOutQuad',
  
    })
    titleBool=true
  }
  else{
    $("#section-title").css("display","none");
    $("#section-title").css("opacity","0");
    titleBool=false
  }

})

$("#set-title").click(function(){
  //Tomar lo que haya en input-title
  var inputTitle = $("#input-title").val()
  if(inputTitle != ''){

    var text = new fabric.Text(inputTitle, {
      left: 10, 
      top: 10,
      fontFamily: 'Poppins',
      fontSize:10,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      fill: '#9baacf'
      });
    canvas.add(text);
  }
  else{
    alert('Agrega un Nombre válido al espacio')
  }

})

// Agregar Espacio, lugar en donde se va mostrar el posicionamiento indoor
var spaceBool=false;
$("#open-space").click(function(){
  if(!spaceBool){
    console.log("agregar título")
    $("#section-space").css("display","block");
    anime({
      targets: '#section-space',        
      opacity: '1',
      duration: 1000,
      easing: 'easeInOutQuad',
  
    })
    spaceBool=true
  }
  else{
    $("#section-space").css("display","none");
    $("#section-space").css("opacity","0");
    spaceBool=false
  }

})

$("#add-space").click(function(){

  var space_name = $("#space-name").val()
  console.log(space_name)

  if(space_name != ""){

    var shadow = new fabric.Shadow({
      color: '#9baacf',
      blur: 10
    });

      const rect= new fabric.Rect({
        width:100,
        height:100,
        fill:'#e4ebf5',
        shadow: shadow,
        strokeWidth: 3,
        opacity:1,
        centeredScaling:true,

    });

    rect.toObject = (function(toObject) {
        return function() {
          return fabric.util.object.extend(toObject.call(this), {
            name: this.name
          });
        };
      })(rect.toObject);
    
    canvas.add(rect)
    canvas.sendToBack(rect)

    rect.name = space_name;
    var text = new fabric.Text(rect.name, {
      left: 10, 
      top: 10,
      fontFamily: 'Poppins',
      fontSize:10,
      textAlign: 'center',
      originX: 'center',
      originY: 'center',
      fill: '#9baacf'
      });
    canvas.add(text);
    //canvas.renderAll()

  }

  else{
    alert("Llena el input")
  }

  
})

//Agregar estación, las estaciones de escaneo de Zaboo
var stationBool=false;
$("#add-station").click(function(){
  if(!stationBool){
    console.log("agregar título")
    $("#section-station").css("display","block");
    anime({
      targets: '#section-station',        
      opacity: '1',
      duration: 1000,
      easing: 'easeInOutQuad',
  
    })

    //Colocar la cantidad de estaciones a las que tenga acceso tomar lo que haya en el array del otro archivo
    $("#section-station").empty()
    stations.forEach(function(station){
      console.log(station)
     
      $("#section-station").append(`
      <div class="btn btn__primary col-12 mt-1 "onclick="placeStation(this.id)" id="btn-${station}">${station}</div>
      `)
      
    })
    
    stationBool=true
  }
  else{
    $("#section-station").css("display","none");
    $("#section-station").css("opacity","0");
    stationBool=false
  }

})


function placeStation(id){
  //Tomar el id y modificarlo para ponerlo dentro del nombre del circulo
  var mod_id= id.substr(4,id.length -1 )

  if($(`#${mod_id}`).length === 0 ){

    var circle = new fabric.Circle({
      radius: 8, 
      fill: '#6d5dfc', 
      left: 100, 
      top: 100,
      opacity:0.5,
      hasControls:false  

  });

  circle.toObject = (function(toObject) {
    return function() {
      return fabric.util.object.extend(toObject.call(this), {
        name: this.name
      });
    };
  })(circle.toObject);

  circle.name = mod_id;
  
  canvas.add(circle);
  canvas.bringToFront(circle)

  }

  else{
    alert(`${mod_id} Ya fue agregado al canvas`)
  }

}


// Borrar el item que ha sido seleccionado

function deleteObjects(){
	var activeObject = canvas.getActiveObject()
    if (activeObject) {
        
        if (confirm('Seguro quieres eliminar el objeto=')) {
            canvas.remove(activeObject);
            var id_delete=activeObject["name"]
            $(`#${id_delete}`).remove()
            var canvas_save= JSON.stringify(canvas);
            renderStaticCanvas(canvas_save)

        }
    }

}

function renderStaticCanvas(canvas_save){
  var canvasJSON=JSON.parse(canvas_save)
  var objects= canvasJSON['objects']

  //Sacar la posicion del canvas
  var canvas_position= $("#canvas-static").offset();
  var canvasPosLeft=canvas_position.left
  var canvasPosTop=canvas_position.top

  var minX=1000;
  var maxX=0;
  var minY=1000;
  var maxY=0;

  objects.forEach(element => {
    
    if(element['type']==='circle'){
      //console.log(element)
      //Guardar las coordenadas y renderizar las estaciones en el canvas no editable
      var top=element['top']
      var left=element['left']
  
      var name=element['name']

      if($(`#${name}`).length === 0 ){
        console.log(`No existe ${name}, agregar`)
        addStation(name)
      }
  
      //console.log(canvasPosLeft+left,canvasPosTop+top)
      placeDiv(canvasPosLeft+left-9,canvasPosTop+top-9,name)
      

    }
  
    //poner los beacons con limte de movimientos
    else if(element['type']==='rect'){
      var topRect=element['top']
      var leftRect=element['left']
      //las siguientes son las coordenadas en x
      var rightRect=element['width']*element['scaleX']+leftRect;
      //las siguientes son las coordenadas en y
      var bottomRect=element['height']*element['scaleY']+topRect;
      $("body").append(`<div class="beacon-limiter" id="placeLimiter"></div>`)

      //Determinar cual elemento esta más cercano a la izquierda
      if(leftRect < minX){
        minX=leftRect;
      }
      if(topRect < minY){
        minY=topRect;
      }
      if(rightRect > maxX){
        maxX=rightRect;
      }
      if(bottomRect > maxY){
        maxY=bottomRect;
      }

    }

  });
  //console.log(maxX-minY)
  if(maxX-minY!==-1000){
    placeLimiter(canvasPosLeft+minX, canvasPosTop+minY,maxX-minX,maxY-minY)
    placeBeacon(canvasPosLeft+minX,canvasPosTop+minY,maxX-minX,maxY-minY)
  }

  
  canvasStatic.loadFromJSON(canvas_save)
}



// //---------------------------coordenadas
// document.addEventListener('mousemove', (event) => {
//   console.log(event)
// 	console.log(`Mouse X: ${event.clientX}, Mouse Y: ${event.clientY}`);
// });
window.onresize = reportWindowSize;

function reportWindowSize(){
  var canvas_save= JSON.stringify(canvas);
 
  //renderizar en el otro otro canvas
  if(window.innerWidth>780){
    canvas.setWidth(400);
  }
  else if(window.innerWidth>440){
    canvas.setWidth(300);
  }
  else{
    canvas.setWidth(200);
  }
  
  renderStaticCanvas(canvas_save)
}

// $(".kit-components").click(function(){
//   console.log("hey")

//     anime({
//       targets: '.kit-components',
//       width: '50%', // -> from '28px' to '100%',
//       easing: 'easeInOutQuad',
//       direction: 'normal',
//       loop: false
//     });
// })

function addStation(id){
  $("body").append(`

    <div class="station" id="${id}" title="${id}">
            <span class="station__btn" >
                <ion-icon class="icon-zaboo" name="pause">B</ion-icon>
                <ion-icon class="play" name="play"></ion-icon>
              </span>
              <span class="circle__back-1"></span>
              <span class="circle__back-2"></span>
        </div>
    
        `)
}
//19 mayo 80
anime({
  targets :'.battery-level',
  width: '100%', // -> from '28px' to '100%',
  easing: 'easeInOutQuad',
  direction: 'alternate',
  loop: true
  
})

function mouseDown(){
  $(".battery").css("scale","0.8")
  $("#p-station").css("scale","0.8")
}

function mouseUp(){

  $(".battery").css("scale","1")
  $("#p-station").css("scale","1")
}

// anime({
//   targets :'.status',
//   scale:'0.7',
//   duration: 500,
//   easing: 'easeInOutQuad',
//   direction: 'alternate',
//   loop: true
  
// })
