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

	if ( ai.multiplayer )
		ai.multiplayer = false;
	else
		ai.multiplayer = true;

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

function prepareFrame( field ) {

	// console.log( Math.ceil( ball.vx ), Math.ceil(ball.vy));
	// console.log( ball.vx, ball.vy );

	// field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( -ball.vy ) * 2, Math.ceil( ball.vx ) * 2   );	
	// field.setVelocity( Math.floor( ball.x + ball.width / 2 ), Math.floor( ball.y + ball.height / 2 ), Math.ceil( ball.vy ) * 2, Math.ceil( -ball.vx ) * 2  );	
	var player_ab = rotator( distanceRotators[0] );
	var ai_ab = rotator( distanceRotators[1] );
	var ball_ab = rotator( distanceRotators[2] );

	player.color = cielabToRGB( L, player_ab[0], player_ab[1], [0.9642, 1, 0.8249 ] )

	ai.color = cielabToRGB( L, ai_ab[0], ai_ab[1], [0.9642, 1, 0.8249 ] )
	// player.color = player.stream;
	ball.color = cielabToRGB( L, ball_ab[0], ball_ab[1], [0.9642, 1, 0.8249 ] )	

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

	field.setDensityRGB( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), ball.color );				

    // var RGB2 = cielabToRGB( 0, RGB[0], 0, [0.9642, 1, 0.8249 ] );
	// var RGB3 = cielabToRGB( 0, 0, RGB[1], [0.9642, 1, 0.8249 ] );
    // var RGB4 = cielabToRGB( RGB[2], 0, 0, [0.9642, 1, 0.8249 ] );	
	// field.setDensityG( Math.floor( ball.x  ) , Math.floor( ball.y ), 100);				
	// field.setDensity( Math.floor( ball.x + ball.width / 2  ) , Math.floor( ball.y + ball.height / 2 ), 100);				
	
	if ( player.push ) {

		field.setVelocity( Math.floor( player.x + player.width / 2 ), Math.floor( player.y + player.height / 2 ), 50, 0 );	
		field.setDensityRGB( Math.floor( player.x + player.width / 2  ) , Math.floor( player.y + player.height / 2 ), player.color);				

		 // jet_shoot.play();
		
	}
	
	if ( player.suck ) {
		
		// player.explode = true;
		field.setVelocity( Math.floor( player.x + player.width / 2 ), Math.floor( player.y + player.height / 2 ), 1000, 0 );	

		// paddle_blast.play();
		// field.setDensityRGB( Math.floor( player.x + player.width / 2 + 20 ) , Math.floor( player.y + player.height / 2 ), [ 500, 500, 500 ] );

	}				

	if ( ai.push ) {

		field.setVelocity( Math.floor( ai.x + ai.width / 2 ), Math.floor( ai.y + ai.height / 2 ), -50, 0 );	
		field.setDensityRGB( Math.floor( ai.x + ai.width / 2  ) , Math.floor( ai.y + ai.height / 2 ), ai.color );				

		 // jet_shoot.play();
		
	}	

	if ( ai.suck ) {

		field.setVelocity( Math.floor( ai.x + ai.width / 2 ), Math.floor( ai.y + ai.height / 2 ), -1000, 0 );	
		
		// paddle_blast.play();
		// field.setVelocity( Math.floor( ai.x - ai.width / 2 - 20  ), Math.floor( ai.y + ai.height / 2 ), 50, 0 );	
		// field.setDensityRGB( Math.floor( ai.x - ai.width / 2 - 20 ) , Math.floor( ai.y + ai.height / 2 ), [500,500,500]);

	}

}

function stopAnimation() {
	
	if ( running ) {
		
		clearInterval( clear_id );
		running = false;

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

function begin() {

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

window.onload = begin;
