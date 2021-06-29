/*!
* Start Bootstrap - Simple Sidebar v6.0.1 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
anime({
    targets:'.square',
    duration: 3000,
    scale: 1.5,
    loop: true
});

anime({
    targets:'.beacon',
    keyframes: [
      
      {translateX: 100},
      {translateY: 40},
      {translateX: 0},
      {translateY: 0}
    ],
    duration: 6000,
    easing: 'easeOutElastic(1, .8)',
    loop: true,
    
});


var wave1 = anime({
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

var wave2 = anime({
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

$( ".station__btn" ).click(function() {

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

function placeDiv(x_pos, y_pos) {
    var d = document.getElementById('zaboo-station');
    d.style.position = "absolute";
    d.style.left = x_pos+'px';
    d.style.top = y_pos+'px';
}

// Aqui pondre los contructores de canvas js
const canvas= new fabric.Canvas('canvas',{
    width:400,
    height:150,
    backgroundColor:'#e4ebf5',
    selection:false
})
canvas.renderAll()

//Eventos del canvas
// canvas.on('mouse:over',(e)=>{
//     console.log(e)
// })
// let currentMode;
// const modes = {

// }

$("#add-space").click(function(){
    console.log('Hey')
    const rect= new fabric.Rect({
        id:'rectangulo',
        width:100,
        height:100,
        fill:'#e4ebf5',
        stroke: 'white',
        strokeWidth: 3

    });
    rect.on('selected', function(e) {
        console.log(e)
        console.log('selected a rectangle');
      });
    canvas.add(rect)
    canvas.renderAll()
})




$(".grid-item").click(function(e){
    placeDiv(0, 0)
    console.log('grillo')
    var x_pos = e.clientX;
    var y_pos = e.clientY;
    console.log(x_pos)
    placeDiv(x_pos, y_pos)

})

