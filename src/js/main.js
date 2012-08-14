var res;
var displaySize = 512;
var fieldRes;
var clear_id;
var running = false;
var canvas = document.getElementById("canvas");

// var beep = new Audio("./assets/beep.wav"); // buffers automatically when created
// var ball_pop = new Audio("./assets/ball_pop.wav"); // buffers automatically when created
// var button_press = new Audio("./assets/button_press.wav"); // buffers automatically when created
// var button_select1 = new Audio("./assets/button_select1.wav"); // buffers automatically when created
// var button_select2 = new Audio("./assets/button_select2.wav"); // buffers automatically when created
// var jet_shoot = new Audio("./assets/jet_shoot.wav"); // buffers automatically when created
// var paddle_blast = new Audio("./assets/paddle_blast.wav"); // buffers automatically when created
// var paddle_hit = new Audio("./assets/paddle_hit.wav"); // buffers automatically when created
// var paddle_suck = new Audio("./assets/paddle_suck.wav"); // buffers automatically when created
// var wall_hit = new Audio("./assets/wall_hit.wav"); // buffers automatically when created
// var battle_loop = new Audio("./assets/battle_loop.mp3"); // buffers automatically when created
// var intro_loop = new Audio("./assets/intro_loop.mp3"); // buffers automatically when created



// battle_loop.loop = true;
// intro_loop.loop = true;

// intro_loop.play();

// battle_loop.play();

// beep.play();
// ball_pop.play();
// button_press.play();
// button_select1.play();
// button_select2.play();
// jet_shoot.play();
// paddle_blast.play();
// paddle_hit.play();
// paddle_suck.play();
// wall_hit.play();

var L = 75;

var distanceRotators = [ 0, 201, 401 ];

function multiplayer() {

	if ( pong.ai.multiplayer )

		pong.ai.multiplayer = false;

	else

		pong.ai.multiplayer = true;
		pong.ai.push = true;

}

function restart() {

 begin();

}

function rotator( a ) {

	if ( a >= 0 && a <= 200 ){

		return [ 200 - (100 + a), 100 ];

	} else if ( a > 200 && a <= 400 ) {

		return [ -100 + (a - 200), 100 - (a - 200) ];

	} else if ( a > 400 && a <= 600 ) {

		return [ 100, -100 + (a - 400) ]

	}


}

var field;
var pong;

function explosion(  ) {

	
	// field.setDensityRGB( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), ball.color );				
	// field.setVelocity( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), 1000, 0 );	


}

var counter = 0;
var suck_counter_1 = 100;

function prepareFrame(field) {

	if ( field ) {

	// var field = abs;
	// console.log(abs)

    // console.log( field.getXVelocity(Math.round( pong.ball.x ), Math.round( pong.ball.y ) ) / 7 )

	// console.log( Math.ceil( ball.vx ), Math.ceil(ball.vy));
	// console.log( ball.vx, ball.vy );

	// field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( -ball.vy ) * 2, Math.ceil( ball.vx ) * 2   );	
	// // field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( ball.vy ) * 2, Math.ceil( -ball.vx ) * 2  );	
	var player_ab = rotator( distanceRotators[0] );
	var ai_ab = rotator( distanceRotators[1] );
	var ball_ab = rotator( distanceRotators[2] );

	pong.player.color = cielabToRGB( L, player_ab[0], player_ab[1], [0.9642, 1, 0.8249 ] )

	pong.ai.color = cielabToRGB( L, ai_ab[0], ai_ab[1], [0.9642, 1, 0.8249 ] )
	// player.color = player.stream;
	pong.ball.color = cielabToRGB( L, ball_ab[0], ball_ab[1], [0.9642, 1, 0.8249 ] )	

	for ( var i = 0; i < 3; i++ ){

		distanceRotators[i]++;

		if ( distanceRotators[i] > 600 ) {

			distanceRotators[i] = 0;
		}



	}

	// ai.stream = player.stream;
	// ball.stream = player.stream;

	// ai.color = cielabToRGB( L, distanceRotator, distanceRotator, [0.9642, 1, 0.8249 ] )
	// player.color = cielabToRGB( L, distanceRotator, distanceRotator, [0.9642, 1, 0.8249 ] )

	field.setDensityRGB( Math.floor( pong.ball.x + pong.ball.radius / 2  ) , Math.floor( pong.ball.y + pong.ball.radius / 2 ), pong.ball.color );				

    // var RGB2 = cielabToRGB( 0, RGB[0], 0, [0.9642, 1, 0.8249 ] );
	// var RGB3 = cielabToRGB( 0, 0, RGB[1], [0.9642, 1, 0.8249 ] );
    // var RGB4 = cielabToRGB( RGB[2], 0, 0, [0.9642, 1, 0.8249 ] );	
	// field.setDensityG( Math.floor( ball.x  ) , Math.floor( ball.y ), 100);				
	// field.setDensity( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), 100);				
	
	if ( pong.player.push ) {

		field.setVelocity( Math.floor( pong.player.x + pong.player.width / 2 ), Math.floor( pong.player.y + pong.player.height / 2 ), 50, 0 );	
		field.setDensityRGB( Math.floor( pong.player.x + pong.player.width / 2  ) , Math.floor( pong.player.y + pong.player.height / 2 ), pong.player.color);				

		 // jet_shoot.play();
		
	}

	if ( pong.ball.out ){

		if ( pong.ball.xo > canvas.width / 2 ) {
			var x = canvas.width-1;
			var mult = -1;

	} else {

		var mult = 1;
		var x = 0;
	}

	field.setDensityRGB( x, Math.floor( pong.ball.yo + pong.ball.radius / 2 ), pong.ball.color );				
	field.setVelocity( x, Math.floor( pong.ball.yo + pong.ball.radius / 2 ), mult*1000, 0 );		

		counter++;

		if ( counter == 12 ) {
	
			pong.ball.out = false;
			counter = 0;

		}
	}
	
	if ( pong.player.suck ) {
		
		var straight_line_dist = pong.distance(pong.player, pong.ball );

		if ( suck_counter_1 > 90 & suck_counter_1 <= 100  ) {

			// player.explode = true;
			field.setVelocity( 0, Math.floor( pong.player.y + pong.player.height / 2 ), 1000, 0 );				
			field.setDensityRGB( 0, Math.floor( pong.player.y + pong.player.height / 2 ), pong.player.color );
			straight_line_dist = 100;

		} else if ( suck_counter_1 == 0 ){

			suck_counter_1 = 100;
		}

		if ( straight_line_dist < 20 ) {

			pong.ball.x = pong.player.x + 10 + Math.random();
			pong.ball.y = pong.player.y + pong.player.height / 2 + Math.random();
			pong.ball.vx = 0;
			pong.ball.vy = 0;
		}		

		// console.log( suck_counter_1 )
			suck_counter_1--;
		// paddle_blast.play();
		

	}				

	if ( pong.ai.push ) {

		field.setVelocity( Math.floor( pong.ai.x + pong.ai.width / 2 ), Math.floor( pong.ai.y + pong.ai.height / 2 ), -50, 0 );	
		field.setDensityRGB( Math.floor( pong.ai.x + pong.ai.width / 2  ) , Math.floor( pong.ai.y + pong.ai.height / 2 ), pong.ai.color );				

		 // jet_shoot.play();
		
	}	

	if ( pong.ai.suck ) {

		field.setVelocity( Math.floor( pong.ai.x + pong.ai.width / 2 ), Math.floor( pong.ai.y + pong.ai.height / 2 ), -1000, 0 );	
		
		// paddle_blast.play();
		// field.setVelocity( Math.floor( ai.x - ai.width / 2 - 20  ), Math.floor( ai.y + ai.height / 2 ), 50, 0 );	
		// field.setDensityRGB( Math.floor( ai.x - ai.width / 2 - 20 ) , Math.floor( ai.y + ai.height / 2 ), [500,500,500]);

	}

    // Stop using global variables - add accessors
    // pong.ball.vy += field.getYVelocity(Math.round( pong.ball.x ), Math.round( pong.ball.y ) ) * 7;
    // pong.ball.vx += field.getXVelocity(Math.round( pong.ball.x ), Math.round( pong.ball.y ) ) * 7;	

    // console.log( pong.ball.vx );

	}
	
}

function switchAnimation() {

	
	if ( running ) {
		
		running = false;	
		document.getElementById("switch").innerHTML = "Unpause"


	} else {

		running = true;
		document.getElementById("switch").innerHTML = "Pause"

	}



	return;
	
}

var white = [0.9642, 1, 0.8249 ];

function cielabToRGB( L, a, b, white ) {

	x = white[0] * inverseCielab( ( 1 / 116 ) * ( L + 16 ) + ( 1 / 500 ) * a  ) * 255;
	y = white[1] * inverseCielab( ( 1 / 116 ) * ( L + 16 ) ) * 255;
	z = white[2] * inverseCielab( ( 1 / 116 ) * ( L + 16 ) + ( 1 / 200 ) * b  ) * 255;

	return [ x, y, z];
}

function inverseCielab( t ) {

	if ( t > ( 6 / 29 ) ){

		return Math.pow( t, 3);

	} else {

		return 3 * Math.pow( 6 / 29, 2 )* ( t - 4 / 29);

	}


}

function startAnimation() {
	
	running = true;

	return;
	
} 
    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
 
 
    // usage: 
    // instead of setInterval(render, 16) ....
 
    (function animloop(){

      requestAnimFrame(animloop);

      updateFrame();

    })();

// The higher this value, the less the fps will reflect temporary variations
// A value of 1 will only keep the last value
var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;
var avg = Array( 120 );
var avg_index = 0;
var avgs = 0;
var avgs_index = 0;
var benchmarking = true;

function run_benchmark() {

	// http://stackoverflow.com/questions/4787431/check-fps-in-js

	var thisFrameTime = (thisLoop=new Date) - lastLoop;
	frameTime+= (thisFrameTime - frameTime) / filterStrength;
	lastLoop = thisLoop;	

	avg[avg_index] = 1000/frameTime;  		

	if ( avg_index > 6 ) {

		var mini_avg = 0;

		for ( var i = 0; i < avg_index; i++ ) {
			
			mini_avg += avg[avg_index];

		}

		// console.log( mini_avg / avg_index, avg_index );  			

		if ( avgs_index > 1 ){

			if ( avgs < 60 ) {

				updateRes( 24 );

			}

			benchmarking = false;

		}


		avgs += mini_avg / avg_index;

		avgs_index++

		avg_index = 0;

	}

	avg_index++;

}

function updateFrame() {
	
	if ( running ) {
	
		if ( benchmarking ){

			run_benchmark();

		}

		prepareFrame();
		field.update();                    
		pong.loop();

	}
	
}

var r = 96;
var field;

function updateRes( r ) {

		canvas.width = r;
		canvas.height = r;
		fieldRes = r;
		field.setResolution(r, r);
        pong.init(); 

}

var keyDown = function(e) {

	var i;		
	
	for(i in pong.keyMap) {

		if (pong.keyMap.hasOwnProperty(i)) {
		
			if( e.keyCode === pong.keyMap[i].code ) {
			
					pong.keyMap[i].on = true;
					break;
					
				}
				
			}   
		}			

}

var keyUp = function(e) {

	var i;
	
	for(i in pong.keyMap) {

		if (pong.keyMap.hasOwnProperty(i)) {
		
			if( e.keyCode === pong.keyMap[i].code ) {
			
					pong.keyMap[i].on = false;
					break;
					
				}
				
			}   
		}			

}

function begin() {

	field = new FluidField(canvas);
	field.setUICallback(prepareFrame);
	field.setDisplayFunction(field.toggleDisplayFunction(canvas, 0));

	pong = new Pong(canvas);

	window.addEventListener("keydown", keyDown, false);
	window.addEventListener("keyup", keyUp, false);
	
	updateRes(r);     
	startAnimation();
}


window.onload = begin;
