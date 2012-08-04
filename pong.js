var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');
var theta;
var speed_increase = 0.7;

var ball = {

	"x" : 0,
	"y" : 0,
	"speed": 1,
	"width" : 0,
	"height" : 0,
	"color" : "red" ,                    
	"vx" : 0,
	"vy" : 0,
	"ax" : 0.001,
	"ay" : 0.001
	
}      

var ai = {
	"push": false,
	"suck": false,
	"x" : 0,
	"y" : 0,
	"width" : 0,
	"height" : 0,
	"color" : "red" ,  
	"vx" : 0,                    
	"vy" : 0,
	"ax" : 0,
	"ay" : 0
	
}                                

var player = {
	"push": false,
	"suck": false,	
	"x" : 0,
	"y" : 0,
	"width" : 0,
	"height" : 0,
	"color" : "red" ,    
	"vx" : 0,                                
	"vy" : 0,
	"ax" : 0,
	"ay" : 0 
	
}                

var speed = 1;

function updatePlayer() {

	player.vy += player.ay;     

	if ( keyMap.up.on ) {
	
		player.ay = -speed_increase;
		
		if ( player.vy < -speed ) {
			
			player.vy = -speed;
			
		}
		
	}                    
	
	 if ( keyMap.right.on ) {
	
		player.push = true;

		
	} else {
		
		player.push = false;
		
	}
	
	 if ( keyMap.left.on ) {
	
		player.suck = true;

		
	} else {
		
		player.suck = false;
		
	}	
	
	if ( keyMap.down.on ) {
	
		player.ay = speed_increase;
		
		if ( player.vy > speed ) {
			
			player.vy = speed;
			
		}

	}
	
	if ( ( !(keyMap.down.on) && !(keyMap.up.on) ) || (keyMap.down.on && keyMap.up.on) ) {
		
		player.ay = 0;
		player.vy = 0;
	
	}
	
	if ( ( player.y < 0 && player.vy < 0 ) || ( player.y + player.height > ctx.canvas.height && player.vy > 0 ) ) {
		
		player.ay = 0;
		player.vy = 0;
		
	}
	
	player.y += player.vy;    
	
}


function updateAi() {

// calculate the middle of the paddle 
real_y_pos = ai.y + (ai.height / 2); 

/* If the ball is moving in opposite direction to the paddle and is no danger for computer's goal move paddle back to the middle y - position*/ 
if ( ball.vx < 0 ) {

	// if the paddle's position is over the middle y - position 
	if ( real_y_pos < ctx.canvas.height / 2 - ctx.canvas.height / 10 ) {
	
		ai.y  += speed; 
		
	} 

	// Paddle is under the middle y - position 
	else if (   real_y_pos > ctx.canvas.height / 2 + ctx.canvas.height / 10  ) {
	
		ai.y  -= speed; 
		
	}
	
} 
// ball is moving towards paddle 
else if ( ball.vx > 0 ) {

	// As long as ball's y - position and paddle's y - position are different 
	if (  Math.abs(ball.y - real_y_pos ) > 2 ) {
	
		// If ball's position smaller than paddle's, move up 
		if (ball.y < real_y_pos) {
		
			ai.y -= speed; 
			
		} 
		
		// If ball's position greater than padle's, move down 
		else if ( ball.y > real_y_pos ) {
		
		 ai.y  += speed; 
		 
		}
	
	}

}

}                           

function updateBall() {
	
	// x
	if ( ( ball.x < 0 && ball.vx < 0 ) || ( ball.x + ball.width > ctx.canvas.width && ball.vx > 0 ) ) {

		ball.x = ( ctx.canvas.width - ball.width ) / 2;
		ball.y = ctx.canvas.height / 2;
		
		theta = Math.random() * 2*Math.PI;
		if(theta > Math.PI/4 && theta < 3* Math.PI/4) {
			theta = Math.round(Math.random()) === 1 ? Math.PI/4 : 3 * Math.PI/4;
		}
		if(theta > Math.PI + Math.PI/4 && theta < 3* Math.PI/4 + Math.PI) {
			theta = Math.round(Math.random()) === 1 ? Math.PI/4 + Math.PI : 3 * Math.PI/4 + Math.PI;
		}
		ball.vx = ball.speed * Math.cos(theta);
		ball.vy = ball.speed * Math.sin(theta);
		//field.reset();
		
		if ( Math.round( Math.random() ) === 1 ) {
		
		ball.vy = -ball.vy;
		
		}
		
	}
	
	ball.vx += ball.ax;
	ball.x += ball.vx;
	
	// pong
	if ( (ball.x < player.x + player.width && player.y < ball.y + 0.1 * player.height && ball.y < player.y + 1.1 * player.height ) ) {
		theta = ((player.y + player.height/2) - ball.y ) / ( player.height  /  2 );
		ball.vx = ball.speed * Math.cos(theta);
		ball.vy = -ball.speed * Math.sin(theta);
	}
	if ( ( ball.x > ai.x ) && (ai.y < ball.y ) && ( ball.y < ai.y + ai.height ) ) {
		theta = ((ai.y + ai.height/2) - ball.y ) / ( ai.height  /  2 );
		ball.vx = -ball.speed * Math.cos(theta);
		ball.vy = ball.speed * Math.sin(theta);
	}

   // y
	if ( ( ball.y < 0 && ball.vy < 0 ) || ( ball.y + ball.height > ctx.canvas.height && ball.vy > 0 ) ) {
	
		ball.vy = -ball.vy;
		
	}
	
  ball.vy += ball.ay;   
  ball.y += ball.vy;           

}                

function update() {

	updatePlayer();
	updateAi();
	updateBall();
	   
}

function clear() {

	// Store the current transformation matrix
	ctx.save();

	// Use the identity matrix while clearing the canvas
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	// Restore the transform
	ctx.restore();
	
}

function drawRectangle( x, y, width, height, color ) {

	ctx.fillStyle = color;
	ctx.fillRect( x, y, width, height );
	
}

function drawPlayer( player ) {

	drawRectangle( player.x , player.y, player.width, player.height, player.color ) ;                    

}

function render() {

	drawPlayer( player );
	drawPlayer( ai );                    
	drawPlayer( ball );

}

function loop() {

	update();
	render();
	
}

function init() {

	var pong_width = ctx.canvas.width / 150
	var pong_height = ctx.canvas.height / 7
	
	var screen_width = ctx.canvas.width;
	var screen_height= ctx.canvas.height;
	
	ai.width = pong_width;
	ai.height = pong_height;
	
	ai.x =  screen_width - ai.width;
	ai.y = screen_height / 2;
	
	player.width = pong_width;
	player.height = pong_height;               
	
	player.y = screen_height / 2;
	
	ball.width = pong_width*2;
	ball.height = pong_width*2;
		
	theta = Math.PI;
	
	if ( theta > Math.PI/4 && theta < 3* Math.PI/4 ) {
		
		theta = Math.round(Math.random()) === 1 ? Math.PI/4 : 3 * Math.PI/4;
		
	}
	
	if( theta > Math.PI + Math.PI/4 && theta < 3* Math.PI/4 + Math.PI ) {
		
		theta = Math.round(Math.random()) === 1 ? Math.PI/4 + Math.PI : 3 * Math.PI/4 + Math.PI;
		
	}
	
	ball.vx = ball.speed * Math.cos(theta);
	ball.vy = ball.speed * Math.sin(theta);
	
	ball.x = ( ctx.canvas.width - ball.width ) / 2;
	ball.y = ctx.canvas.height / 2;
	
}

var keyMap = {
	"left": { "code" : 65, "on": false },
	"up": { "code" : 87, "on": false },
	"right": { "code" : 68, "on": false },
	"down": { "code" : 83, "on": false }
}                     

window.addEventListener("keydown", function(e) {

	for(var i in keyMap) {
	
		if( e.keyCode === keyMap[i].code ) {
		
				keyMap[i].on = true;
				break;
				
			}
			
		}   
		
}, false);                


window.addEventListener("keyup", function(e) {

	for(var i in keyMap) {
	
		if( e.keyCode === keyMap[i].code ) {
		
				keyMap[i].on = false;
				break;
				
			}
			
		}                 
		
}, false);
           
