var frames = 0;
var force = 5;
var source = 100;
var sources = [];
var omx, omy;
var mx, my;
var mouseIsDown = false;
var res;
var displaySize = 512;
var fieldRes;
var canvas = document.getElementById("canvas");

function prepareFrame( field ) {
	
	if ( player.push ) {
		
		field.setVelocity( Math.floor( player.x + player.width / 2 ), Math.floor( player.y + player.height / 2 ), 50, 0 );	
		field.setDensity( Math.floor( player.x + player.width / 2  ) , Math.floor( player.y + player.height / 2 ), 50);				
		
	}
	
	if ( player.suck ) {
		
		field.setVelocity( Math.floor( player.x + player.width / 2 + 30 ), Math.floor( player.y + player.height / 2 ), -50, 0 );	
		field.setDensity( Math.floor( player.x + player.width / 2 + 10 ) , Math.floor( player.y + player.height / 2 ), 100);
		
		
	}				

}

function stopAnimation() {
	
	clearInterval(updateFrame);
	
}

function startAnimation() {
	
	setInterval( updateFrame, 1000/60 );
	
}


function updateFrame() {
	
	field.update();                    
	loop();
	
}

window.onload=function(){
	
	init();
	
	field = new FluidField(canvas);
	field.setUICallback(prepareFrame);
	field.setDisplayFunction(toggleDisplayFunction(canvas));
	
	updateRes = function() {
		
		var r = 96;
		canvas.width = r;
		canvas.height = r;
		fieldRes = r;
		field.setResolution(r, r);
		
	}
	
	updateRes();     
	startAnimation();
	
}
