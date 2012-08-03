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
var clear_id;
var running = false;
var canvas = document.getElementById("canvas");

function prepareFrame( field ) {
	
	if ( player.push ) {
		
		field.setVelocityInterp( Math.floor( player.x + player.width / 2 ), Math.floor( player.y + player.height / 2 ), 50, 0 );	
		field.setDensity( Math.floor( player.x + player.width / 2  ) , Math.floor( player.y + player.height / 2 ), 100);				
		
	}
	
	if ( player.suck ) {
		
		field.setVelocityInterp( Math.floor( player.x + player.width / 2 + 30 ), Math.floor( player.y + player.height / 2 ), -50, 0 );	
		field.setDensity( Math.floor( player.x + player.width / 2 + 10 ) , Math.floor( player.y + player.height / 2 ), 100);
		
		
	}				

}

function stopAnimation() {
	
	clearInterval( clear_id );
	running = false;
	return;
	
}

function startAnimation() {
	
	clear_id = setInterval( updateFrame, 1000/60 );
	running = true;
	return;
	
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
