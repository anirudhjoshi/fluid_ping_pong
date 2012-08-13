// (function () {

	// "use strict";
	// better control method?
	function Pong(canvas) {

		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');

		this.theta = 0;
		this.speed_increase = 0.7;
		this.speed = 1;

		this.ball = {
			"x" : 0,
			"y" : 0,
			"xo" : 0,
			"yo" : 0,
			"out" : false,
			"radius": 0,
			"speed": 1,
			"color" : "red",
			"vx" : 0,
			"vy" : 0,
			"ax" : 0.001,
			"ay" : 0.001
		};

		this.ai = {
			"push": true,
			"suck": false,
			"stream": [ 0, 0, 0],
			"multiplayer": false,
			"x" : 0,
			"y" : 0,
			"width" : 0,
			"height" : 0,
			"color" : "red",
			"vx" : 0,
			"vy" : 0,
			"ax" : 0,
			"ay" : 0
		};

		this.player = {
			"push": false,
			"suck": false,
			"explode": false,
			"stream": [ 0, 0, 0],
			"x" : 0,
			"y" : 0,
			"width" : 0,
			"height" : 0,
			"color" : "red",
			"vx" : 0,
			"vy" : 0,
			"ax" : 0,
			"ay" : 0
		};

		this.updatePlayer = function () {

			if (this.keyMap.up.on) {
				this.player.ay = -this.speed_increase;
				if (this.player.vy < -this.speed) {
					this.player.vy = -this.speed;
				}
			}
			if (this.keyMap.right.on) {
				this.player.push = true;
			} else {
				this.player.push = false;
			}
			if (this.keyMap.left.on) {
				this.player.suck = true;
			} else {
				this.player.suck = false;
			}	
			if (this.keyMap.down.on) {
				this.player.ay = this.speed_increase;
				
				if (this.player.vy > this.speed) {
					this.player.vy = this.speed;
					
				}

			}
			
			if ( ( !(this.keyMap.down.on) && !(this.keyMap.up.on) ) || (this.keyMap.down.on && this.keyMap.up.on) ) {
				
				this.player.ay = 0;
				this.player.vy = 0;
			
			}
			
			if ( ( this.player.y < 0 && this.player.vy < 0 ) || ( this.player.y + this.player.height > this.ctx.canvas.height && this.player.vy > 0 ) ) {
				
				this.player.ay = 0;
				this.player.vy = 0;
				
			}

			this.player.vy += this.player.ay;			
			this.player.y += this.player.vy;    

		};

		this.updateAi = function () {

			var ai = this.ai,
				keyMap = this.keyMap,
				speed_increase = this.speed_increase,
				speed = this.speed,
				ctx = this.ctx,
				ball = this.ball,
				real_y_pos = 0;

			if ( ai.multiplayer ) {

					ai.vy += ai.ay;     

					if ( keyMap.up2.on ) {
					
						ai.ay = -speed_increase;
						
						if ( ai.vy < -speed ) {
							
							ai.vy = -speed;
							
						}
						
					}                    
					
					if ( keyMap.left2.on ) {
					
						ai.push = true;

						
					} else {
						
						ai.push = false;
						
					}
					
					if ( keyMap.right2.on ) {
					
						ai.suck = true;

						
					} else {
						
						ai.suck = false;
						
					}	
					
					if ( keyMap.down2.on ) {
					
						ai.ay = speed_increase;
						
						if ( ai.vy > speed ) {
							
							ai.vy = speed;
							
						}

					}
					
					if ( ( !(keyMap.down2.on) && !(keyMap.up2.on) ) || (keyMap.down2.on && keyMap.up2.on) ) {
						
						ai.ay = 0;
						ai.vy = 0;
					
					}
					
					if ( ( ai.y < 0 && ai.vy < 0 ) || ( ai.y + ai.height > ctx.canvas.height && ai.vy > 0 ) ) {
						
						ai.ay = 0;
						ai.vy = 0;
						
					}
					
					ai.y += ai.vy;    


				} else {

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

				this.ai = ai;

		};

		this.updateBall = function (){

			var ball = this.ball,
				player = this.player,
				theta = this.theta,
				ai = this.ai,
				ctx = this.ctx;

				// pong
			if ( ( Math.abs( ball.x  - player.x ) < Math.abs( ball.vx ) && player.y < ball.y + 0.1 * player.height && ball.y < player.y + 1.1 * player.height ) ) {
				theta = ((player.y + player.height/2) - ball.y ) / ( player.height  /  2 );
				ball.vx = ball.speed * Math.cos(theta);
				ball.vy = -ball.speed * Math.sin(theta);

			}
			
			if ( ( Math.abs(ball.x - ai.x) < ball.vx && ball.y > ai.y && ball.y < ai.y + ai.height ) ) {

				theta = ((ai.y + ai.height/2) - ball.y ) / ( ai.height  /  2 );
				ball.vx = -ball.speed * Math.cos(theta);
				ball.vy = ball.speed * Math.sin(theta);
			}

			// y
			if ( ( ball.y < 0 && ball.vy < 0 ) || ( ball.y + ball.radius > ctx.canvas.height && ball.vy > 0 ) ) {
			
				ball.vy = -ball.vy;

			}


			// x
			if ( ( ball.x < 0 && ball.vx < 0 ) || ( ball.x + ball.radius > ctx.canvas.width && ball.vx > 0 ) ) {

				ball.xo = ball.x;
				ball.yo = ball.y;

				ball.out = true;

				ball.x = ( ctx.canvas.width - ball.radius ) / 2;
				ball.y = ctx.canvas.height / 2;
				
				theta = Math.random() * 2*Math.PI;

				if (theta > Math.PI/4 && theta < 3* Math.PI/4) {

					theta = Math.round(Math.random()) === 1 ? Math.PI/4 : 3 * Math.PI/4;

				}

				if (theta > Math.PI + Math.PI/4 && theta < 3* Math.PI/4 + Math.PI) {

					theta = Math.round(Math.random()) === 1 ? Math.PI/4 + Math.PI : 3 * Math.PI/4 + Math.PI;

				}

				ball.vx = ball.speed * Math.cos(theta);
				ball.vy = ball.speed * Math.sin(theta);
				
				if ( Math.round( Math.random() ) === 1 ) {
				
					ball.vy = -ball.vy;
				
				}
				
			}		

			ball.vx += ball.ax;
			ball.x += ball.vx;

			ball.vy += ball.ay;   
			ball.y += ball.vy; 

			this.ball = ball;

		};

		this.distance = function ( player1, player2 ) {

			return Math.sqrt( Math.pow(player2.x - player1.x, 2) + Math.pow( player2.y - player1.y, 2) );

		};

		this.update = function(){

			this.updatePlayer();
			this.updateAi();
			this.updateBall();		


		};

		this.clear = function () {

			var ctx = this.ctx;

			// attribute - stack overflow answer
			// Store the current transformation matrix
			ctx.save();

			// Use the identity matrix while clearing the canvas
			ctx.setTransform(1, 0, 0, 1, 0, 0);
			ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

			// Restore the transform
			ctx.restore();


		};

		this.drawRectangle = function( x, y, width, height, color ) {

			if (color instanceof Array) {

				this.ctx.fillStyle = "rgb(" + Math.floor( color[0] ) + "," + Math.floor( color[1] ) + "," + Math.floor( color[2] ) + ")";

			} else {

				this.ctx.fillStyle = color;

			}

			this.ctx.fillRect( x, y, width, height );
			
		};

		this.drawPlayer = function( player ) {

			this.drawRectangle( player.x , player.y, player.width, player.height, player.color ) ;                    

		};

		this.drawBall = function ( ball ) {

			this.ctx.beginPath();
			this.ctx.lineWidth = 0.5;
			this.ctx.fillStyle = "black";
			this.ctx.strokeStyle = "white";        
			this.ctx.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
			this.ctx.fill();
			this.ctx.stroke();
		
		};


		this.render = function() {

			this.drawPlayer( this.player );
			this.drawPlayer( this.ai );                    
			this.drawBall( this.ball );

		};

		this.loop = function() {

			this.update();
			this.render();
			
		};

		this.init = function() {

			var pong_width = this.ctx.canvas.width / 75,
				pong_height = this.ctx.canvas.height / 6,
				screen_width = this.ctx.canvas.width,
				screen_height= this.ctx.canvas.height;
			
			this.ai.width = pong_width;
			this.ai.height = pong_height;
			
			this.ai.x =  screen_width - this.ai.width;
			this.ai.y = screen_height / 2;
			
			this.player.width = pong_width;
			this.player.height = pong_height;               
			
			this.player.y = screen_height / 2;
			
			this.ball.radius = pong_width*2;
				
			this.theta = Math.PI;
			
			if ( this.theta > Math.PI/4 && this.theta < 3* Math.PI/4 ) {
				
				this.theta = Math.round(Math.random()) === 1 ? Math.PI/4 : 3 * Math.PI/4;
				
			}
			
			if( this.theta > Math.PI + Math.PI/4 && this.theta < 3* Math.PI/4 + Math.PI ) {
				
				this.theta = Math.round(Math.random()) === 1 ? Math.PI/4 + Math.PI : 3 * Math.PI/4 + Math.PI;
				
			}
			
			this.ball.vx = this.ball.speed * Math.cos(this.theta);
			this.ball.vy = this.ball.speed * Math.sin(this.theta);
			
			this.ball.x = this.ctx.canvas.width / 2;
			this.ball.y = this.ctx.canvas.height / 2;
			
		};

		this.keyMap = {

			"left": { "code" : 65, "on": false },
			"up": { "code" : 87, "on": false },
			"right": { "code" : 68, "on": false },
			"down": { "code" : 83, "on": false },
			"left2": { "code" : 74, "on": false },
			"up2": { "code" : 73, "on": false },
			"right2": { "code" : 76, "on": false },
			"down2": { "code" : 75, "on": false }

		};

	}

// }());