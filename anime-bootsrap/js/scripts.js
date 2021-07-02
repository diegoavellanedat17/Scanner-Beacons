/*!
* Start Bootstrap - Simple Sidebar v6.0.1 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/

//https://codepen.io/Ben_Tran/pen/YYYwNL

anime({
    targets:'.square',
    duration: 3000,
    scale: 1.5,
    loop: true
});

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



// $( ".station__btn" ).click(function() {

//     if (clicked){
//         wave1.restart();
//         wave2.restart();
//         wave1.pause();
//         wave2.pause();
//         clicked=false;
//         $( ".icon-zaboo" ).css("color","#808089");

//     }
//     else{
//         wave1.play();
//         wave2.play();
//         clicked=true;
//         $( ".icon-zaboo" ).css("color","#5b0eeb");
//     }


//   });

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
    width:400,
    height:150,
    backgroundColor:'#e4ebf5',
    selection:false,
    
})
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

$("#add-space").click(function(){


    console.log('Hey')
    var space_name = $("#space-name").val()
    console.log(space_name)

    if(space_name != ""){

        const rect= new fabric.Rect({
          width:100,
          height:100,
          fill:'#e4ebf5',
          stroke: 'white',
          strokeWidth: 3,
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
      console.log("llena el input")
    }

    
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
  

$("#add-station").click(function(){
  console.log("estacion")
  var circle = new fabric.Circle({
      radius: 8, 
      fill: '#6d5dfc', 
      left: 100, 
      top: 100,
      opacity:0.5,
      hasControls:false
      
     
  });

  canvas.add(circle);
  canvas.bringToFront(circle)

})
  
// Remove objects
function deleteObjects(){
	var activeObject = canvas.getActiveObject()
    if (activeObject) {
        if (confirm('Are you sure?')) {
            canvas.remove(activeObject);
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
  var i=0
  objects.forEach(element => {
    
    if(element['type']==='circle'){
      //console.log(element)
      //Guardar las coordenadas y renderizar las estaciones en el canvas no editable
      var top=element['top']
      var left=element['left']
      var id= `zaboo-station${i}`;
      i=i+1;
      addStation(id)
      //console.log(canvasPosLeft+left,canvasPosTop+top)
      placeDiv(canvasPosLeft+left-9,canvasPosTop+top-9,id)
      

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

$( "#add-space" ).mouseover(function() {
  $(".search").css("display","block").fadeIn('slow')
 console.log("aca")
});

function addStation(id){
  $("body").append(`

    <div class="station" id="${id}" >
            <span class="station__btn" >
                <ion-icon class="icon-zaboo" name="pause">B</ion-icon>
                <ion-icon class="play" name="play"></ion-icon>
              </span>
              <span class="circle__back-1"></span>
              <span class="circle__back-2"></span>
        </div>
    
        `)
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
  renderStaticCanvas(canvas_save)
}