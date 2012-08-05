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

	// console.log( Math.ceil( ball.vx ), Math.ceil(ball.vy));
	console.log( ball.vx, ball.vy );

	field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( -ball.vy ) * 2, Math.ceil( ball.vx ) * 2   );	
	field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( ball.vy ) * 2, Math.ceil( -ball.vx ) * 2  );	
	field.setDensityG( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), 100);				
	// field.setDensityG( Math.floor( ball.x  ) , Math.floor( ball.y ), 100);				
	field.setDensity( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), 100);				
	
	if ( player.push ) {
		
		field.setVelocity( Math.floor( player.x + player.width / 2 ), Math.floor( player.y + player.height / 2 ), 50, 0 );	
		field.setDensityG( Math.floor( player.x + player.width / 2  ) , Math.floor( player.y + player.height / 2 ), 100);				
		
	}
	
	if ( player.suck ) {
	
		field.setVelocity( Math.floor( player.x + player.width / 2 + 20 ), Math.floor( player.y + player.height / 2 ), -50, 0 );	
		field.setDensityG( Math.floor( player.x + player.width / 2 + 20 ) , Math.floor( player.y + player.height / 2 ), 500);

	}				

	if ( ai.push ) {

		field.setVelocity( Math.floor( ai.x - ai.width / 2 ), Math.floor( ai.y + ai.height / 2 ), -50, 0 );	
		field.setDensityBl( Math.floor( ai.x - ai.width / 2  ) , Math.floor( ai.y + ai.height / 2 ), 100);				
		
	}	

	if ( ai.suck ) {

		field.setVelocity( Math.floor( ai.x - ai.width / 2 - 20  ), Math.floor( ai.y + ai.height / 2 ), 50, 0 );	
		field.setDensityBl( Math.floor( ai.x - ai.width / 2 - 20 ) , Math.floor( ai.y + ai.height / 2 ), 500);

	}

}

function stopAnimation() {
	
	if ( running ) {
		
		clearInterval( clear_id );
		running = false;

	}

	return;
	
}

function startAnimation() {
	
	if ( !running ) {

		clear_id = setInterval( updateFrame, 1000/60 );
		running = true;

	}
	return;
	
}


function updateFrame() {
	
	field.update();                    
	loop();
	
}

window.onload=function(){
	
	field = new FluidField(canvas);
	field.setUICallback(prepareFrame);
	field.setDisplayFunction(toggleDisplayFunction(canvas));

	init();

	// ai.multiplayer = true;
	
	updateRes = function() {
		
		var r = 96;
		canvas.width = r;
		canvas.height = r;
		fieldRes = r;
		field.setResolution(r, r);
        init(); // make this an injector
		
	}
	
	updateRes();     
	startAnimation();
	
}
