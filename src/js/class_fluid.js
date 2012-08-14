// Based on http://www.dgp.toronto.edu/people/stam/reality/Research/pdf/GDC03.pdf
/**
 ****************************************************
 * Copyright (c) 2009 Oliver Hunt <http://nerget.com>
 ****************************************************
 * Copyright (c) 2012 Anirudh Joshi <http://anirudhjoshi.com>
 **************************************************** 
 * Copyright (c) 2008, 2009, Memo Akten, www.memo.tv
 *** The Mega Super Awesome Visuals Company ***
 ****************************************************
 * All rights reserved. 
 * 
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

 // Check if we have access to contexts
// (function (){

//     'use strict';    

//     if ( this.CanvasRenderingContext2D && !CanvasRenderingContext2D.createImageData ) {
    
//     // Grabber helper function
//     CanvasRenderingContext2D.prototype.createImageData = function ( w, h ) {
        
//         return this.getImageData( 0, 0, w, h);
        
//     };
    
// }



// }());

function FluidField(canvas) {
    'use strict';
    
    // More iterations = much slower simulation (10 is good default)

    this.iterations = 10;

    this.visc = 0.5;
    this.dt = 0.1;

    this.r = null;
    this.r_prev = null;

    this.g = null;
    this.g_prev = null;

    this.bl = null;
    this.bl_prev = null;    

    this.u = null;
    this.u_prev = null;

    this.v = null;
    this.v_prev = null;

    this.width = null;
    this.height = null;

    this.rowSize = null;
    this.size = 0;

    this.displayFunc = null;   

    // Add fields x and s together over dt
    this.addFields = function(x, s, dt) {

        var i;

        for ( i = 0; i < this.size; i += 1 ) {
            
            x[ i ] += dt * s[ i ];

        }

    };

    // Fluid bounding function over a field for stability
    this.set_bnd = function(b, x) {

        var i, j, maxEdge;


        if ( b === 1 ) {

            for ( i = 1; i <= this.width; i += 1 ) {

                x[i] = x[i + this.rowSize];
                x[i + (this.height + 1) * this.rowSize] = x[i + this.height * this.rowSize];

            }

            for (j = 1; i <= this.height; i += 1) {

                x[j * this.rowSize] = -1 * x[1 + j * this.rowSize]; //jslint - gurantee neg
                x[(this.width + 1) + j * this.rowSize] = -1*x[this.width + j * this.rowSize]; //jslint - gurantee neg

            }

        } else if (b === 2) {
            for ( i = 1; i <= this.width; i  += 1) {
                x[i] = -1 * x[i + this.rowSize]; //jslint - gurantee neg
                x[i + (this.height + 1) * this.rowSize] = -1 * x[i + this.height * this.rowSize]; //jslint - gurantee neg
            }

            for ( j = 1; j <= this.height; j += 1) {
                x[j * this.rowSize] =  x[1 + j * this.rowSize];
                x[(this.width + 1) + j * this.rowSize] =  x[this.width + j * this.rowSize];
            }
        } else {
            for ( i = 1; i <= this.width; i  += 1) {
                x[i] =  x[i + this.rowSize];
                x[i + (this.height + 1) * this.rowSize] = x[i + this.height * this.rowSize];
            }

            for ( j = 1; j <= this.height; j  += 1) {
                x[j * this.rowSize] =  x[1 + j * this.rowSize];
                x[(this.width + 1) + j * this.rowSize] =  x[this.width + j * this.rowSize];
            }
        }

        maxEdge = (this.height + 1) * this.rowSize;

        x[ 0 ]                 = 0.5 * ( x[ 1 ] + x[ this.rowSize ] );
        x[ maxEdge ]           = 0.5 * (x[1 + maxEdge] + x[this.height * this.rowSize]);
        x[ ( this.width + 1 ) ]         = 0.5 * (x[this.width] + x[(this.width + 1) + this.rowSize]);
        x[ ( this.width + 1) + maxEdge ] = 0.5 * (x[this.width + maxEdge] + x[(this.width + 1) + this.height * this.rowSize]);

    };

    // This combines neighbour velocities onto selected cell
    this.lin_solve = function(b, x, x0, a, c) {
        
        var i,
            j,
            k,
            invC,
            currentRow,
            lastRow,
            nextRow,
            lastX;

        if (a === 0 && c === 1) {

            for ( j=1 ; j<=this.height; j += 1) {

                currentRow = j * this.rowSize;

                currentRow += 1;

                for ( i = 0; i < this.width; i  += 1) {

                    x[currentRow] = x0[currentRow];
                    currentRow += 1;

                }

            }

            this.set_bnd(b, x);

        } else {

            invC = 1 / c;

            for (k=0 ; k<this.iterations; k  += 1) {

                for (j=1 ; j<=this.height; j  += 1) {

                    lastRow = (j - 1) * this.rowSize;
                    currentRow = j * this.rowSize;
                    nextRow = (j + 1) * this.rowSize;
                    lastX = x[currentRow];

                    currentRow += 1;

                    for (i=1; i<=this.width; i  += 1) {

                        currentRow += 1;
                        lastRow += 1;
                        nextRow += 1;

                        lastX = x[currentRow - 1] = (x0[currentRow - 1] + a*(lastX+x[currentRow]+x[lastRow]+x[nextRow])) * invC;

                }

                this.set_bnd(b, x);

            }

        }

    }

    this.fadeSpeed = 0.01;
    this.holdAmount = 1 - this.fadeSpeed;

    // Fades out velocities/densities to stop full stability
    // MSAFluidSolver2d.java
    this.fade = function( x ) {

        var i;

        for ( i = 0; i < this.size; i += 1) {

            // fade out
            x[i] *= this.holdAmount;

        }

        return;
    };

    // Iterates over the entire array - diffusing dye density
    this.diffuse = function(b, x, x0 ) {

        var a = 0;
        this.lin_solve(b, x, x0, a, 1 + 4*a);

    };
    
    this.lin_solve2 = function(x, x0, y, y0, a, c) {

        var i,
            j,
            k,
            currentRow,
            lastRow,
            nextRow,
            lastX,
            lastY;

        if (a === 0 && c === 1) {
            for ( j=1 ; j <= this.height; j += 1) {

                 currentRow = j * this.rowSize;

                currentRow += 1;
                
                for ( i = 0; i < this.width; i += 1) {

                    x[currentRow] = x0[currentRow];
                    y[currentRow] = y0[currentRow];
                    currentRow += 1;

                }

            }

            this.set_bnd(1, x);
            this.set_bnd(2, y);

        } else {

            invC = 1/c;

            for (k=0 ; k<this.iterations; k += 1) {

                for (j=1 ; j <= this.height; j += 1) {

                    lastRow = (j - 1) * this.rowSize;
                    currentRow = j * this.rowSize;
                    nextRow = (j + 1) * this.rowSize;
                    lastX = x[currentRow];
                    lastY = y[currentRow];

                    currentRow += 1;

                    for (i = 1; i <= this.width; i += 1) {

                        lastX = x[currentRow] = (x0[currentRow] + a * (lastX + x[currentRow] + x[lastRow] + x[nextRow])) * invC;

                        currentRow += 1;
                        lastRow += 1;
                        nextRow += 1;

                        lastY = y[currentRow - 1] = (y0[currentRow - 1] + a * (lastY + y[currentRow] + y[lastRow] + y[nextRow])) * invC;

                    }
                }

                this.set_bnd(1, x);
                this.set_bnd(2, y);

            }
        }

    };
    
    this.diffuse2 = function(x, x0, y, y0 ) {

        var a = 0;
        this.lin_solve2(x, x0, y, y0, a, 1 + 4 * a);

    };
    
    this.advect = function(b, d, d0, u, v, dt) {
        
        var i,
            j,
            pos,
            x,
            y,
            i0,
            i1,
            j0,
            j1,
            s1,
            s0,
            t1, 
            t0,
            row1,
            row2,
            Wdt0 = dt * this.width,
            Hdt0 = dt * this.height,
            Wp5 = this.width + 0.5,  
            Hp5 = this.height + 0.5;

        for ( j = 1; j<= this.height; j += 1) {
             pos = j * this.rowSize;
            for ( i = 1; i <= this.width; i += 1) {

                pos += 1;

                x = i - Wdt0 * u[pos]; 
                y = j - Hdt0 * v[pos - 1];

                if (x < 0.5) {
                
                    x = 0.5;

                }

                else if (x > Wp5) {

                    x = Wp5;

                }

                i0 = x || 0; // |
                i1 = i0 + 1;

                if (y < 0.5) {
                
                    y = 0.5;

                }
                else if (y > Hp5) {
                    
                    y = Hp5;

                }

                j0 = y || 0; // |
                j1 = j0 + 1;
                s1 = x - i0;
                s0 = 1 - s1;
                t1 = y - j0;
                t0 = 1 - t1;
                row1 = j0 * this.rowSize;
                row2 = j1 * this.rowSize;

                d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);

            }
        }

        this.set_bnd(b, d);

    };
    
    this.project = function(u, v, p, div) {

        var h = -0.5 / Math.sqrt(this.width * this.height),
            row,
            previousRow,
            prevValue,
            currentRow,
            nextValue,
            nextRow,
            prevRow,
            wScale,
            hScale,
            prevPos,
            currentPos,
            nextPos,
            i,
            j;

        for (j = 1 ; j <= this.height; j += 1 ) {
            row = j * this.rowSize;
            previousRow = (j - 1) * this.rowSize;
            prevValue = row - 1;
            currentRow = row;
            nextValue = row + 1;
            nextRow = (j + 1) * this.rowSize;
            for (i = 1; i <= this.width; i += 1 ) {

                currentRow += 1;
                nextValue += 1;
                prevValue += 1;
                nextRow += 1;
                previousRow += 1;

                div[currentRow] = h * (u[nextValue] - u[prevValue] + v[nextRow] - v[previousRow]);
                p[currentRow] = 0;
            }
        }
        this.set_bnd(0, div);
        this.set_bnd(0, p);
        
        this.lin_solve(0, p, div, 1, 4 );

        wScale = 0.5 * this.width;
        hScale = 0.5 * this.height;

        for (j = 1; j<= this.height; j += 1 ) {

            prevPos = j * this.rowSize - 1;
            currentPos = j * this.rowSize;
            nextPos = j * this.rowSize + 1;
            prevRow = (j - 1) * this.rowSize;
            currentRow = j * this.rowSize;
            nextRow = (j + 1) * this.rowSize;

            for (i = 1; i<= this.width; i += 1) {

                currentPos += 1; 

                nextPos += 1;
                prevPos += 1;

                nextRow += 1;
                previousRow += 1;

                u[currentPos] -= wScale * (p[nextPos] - p[prevPos]);
                v[currentPos]   -= hScale * (p[nextRow] - p[prevRow]);

            }

        }

        this.set_bnd(1, u);
        this.set_bnd(2, v);

    };
    
    // Move forward in density
    this.dens_step = function() {

        // Stop filling stability
        this.fade( this.r );
        this.fade( this.g );
        this.fade( this.bl );

        // fade( u );
        // fade( v );        

        // Combine old and new fields into the new field
        this.addFields( this.r, this.r_prev, this.dt);
        this.addFields( this.g, this.g_prev, this.dt);
        this.addFields( this.bl, this.bl_prev, this.dt);

        // Diffuse over old and new new field
        this.diffuse(0, this.r_prev, this.r );
        this.diffuse(0, this.g_prev, this.g );
        this.diffuse(0, this.bl_prev, this.bl );

        // Combine vectors into a forward vector model
        this.advect(0, this.r, this.r_prev, this.u, this.v, this.dt );
        this.advect(0, this.g, this.g_prev, this.u, this.v, this.dt );
        this.advect(0, this.bl, this.bl_prev, this.u, this.v, this.dt );

    };
    
    // Move vector fields (u,v) forward over dt
    this.vel_step = function(u, v, u0, v0, dt) {

        var temp;

        this.addFields(u, u0, dt );
        this.addFields(v, v0, dt );
        
        temp = u0; u0 = u; u = temp;
        temp = v0; v0 = v; v = temp;
        
        this.diffuse2(u,u0,v,v0, dt);
        this.project(u, v, u0, v0);
        
        temp = u0; u0 = u; u = temp; 
        temp = v0; v0 = v; v = temp;
        
        this.advect(1, u, u0, u0, v0, dt);
        this.advect(2, v, v0, u0, v0, dt);
        
        this.project(u, v, u0, v0 );

    };

    this.setDensityRGB = function(x, y, d) {

         this.r[(x + 1) + (y + 1) * this.rowSize] = d[0];
         this.g[(x + 1) + (y + 1) * this.rowSize] = d[1];
         this.bl[(x + 1) + (y + 1) * this.rowSize] = d[2];

         return;

    };

    this.getDensityRGB = function(x, y) {

         var r_dens = this.r[(x + 1) + (y + 1) * this.rowSize],
            g_dens = this.g[(x + 1) + (y + 1) * this.rowSize],
            bl_dens = this.bl[(x + 1) + (y + 1) * this.rowSize];

         return [ r_dens, g_dens, bl_dens ];

    }; 

    this.setVelocity = function(x, y, xv, yv) {

         this.u[(x + 1) + (y + 1) * this.rowSize] = xv;
         this.v[(x + 1) + (y + 1) * this.rowSize] = yv;

         return;

    };

    //MSAFluidSolver2d.java
    this.setVelocityInterp = function( x, y, vx, vy ) {

        var colSize = this.rowSize,
            rI = x + 2,
            rJ = y + 2,

            i1 = (x + 2),
            i2 = (rI - i1 < 0) ? (x + 3) : (x + 1),

            j1 = (y + 2),
            j2 = (rJ - j1 < 0) ? (y  + 3) : (y + 1),
            
            diffx = (1-(rI-i1)),
            diffy = (1-(rJ-j1)),
            
            vx1 = vx * diffx*diffy,
            vy1 = vy * diffy*diffx,
            
            vx2 = vx * (1-diffx)*diffy,
            vy2 = vy * diffy*(1-diffx),
            
            vx3 = vx * diffx*(1-diffy),
            vy3 = vy * (1-diffy)*diffx,
            
            vx4 = vx * (1-diffx)*(1-diffy),
            vy4 = vy * (1-diffy)*(1-diffx);
        
        if (i1<2 || i1>this.rowSize-1 || j1<2 || j1>colSize-1) {

             return;

         }

        this.setVelocity(i1, j1, vx1, vy1);
        this.setVelocity(i2, j1, vx2, vy2);
        this.setVelocity(i1, j2, vx3, vy3);
        this.setVelocity(i2, j2, vx4, vy4);

        return;

    };


    this.getXVelocity = function(x, y) {

         return this.u[(x + 1) + (y + 1) * this.rowSize];

    };
    
    this.getYVelocity = function(x, y) {

         return this.v[(x + 1) + (y + 1) * this.rowSize];

    };

    this.displayFunc = null;

    // Push simulation forward one step
    this.update = function () {

        // Move vector fields forward
        // this.u, this.v, this.u_prev, this.v_prev, this.dt
        this.vel_step();

        // Move dye intensity forward
        // dens_step(dens, dens_prev, u, v, dt);
        if ( this.u_prev ){

            //this.r_prev, this.g_prev, this.bl_prev, this.u_prev, this.v_prev, this.r, this.g, this.bl, this.u, this.v, this.dt 
            this.dens_step();

        }

        // Display/Return new density and vector fields
        // new Field(this.r, this.g, this.bl, this.u, this.v)
        this.displayFunc();

    };

    this.setDisplayFunction = function( func ) {

        this.displayFunc = func;

    };

    // Iteration setter and capper
    this.setIterations = function( iters ) {

        if ( iters > 0 && iters <= 100 ){

           this.iterations = iters;

        }           

    };

    this.setUICallback = function( callback ) {
        
        this.uiCallback = callback;

    };

    this.reset = function() {

        this.rowSize = this.width + 2;
        this.size = (this.width+2)*(this.height+2);

        this.r = [];
        this.r_prev = [];

        this.g = [];
        this.g_prev = [];

        this.bl = [];
        this.bl_prev = [];

        this.u = [];
        this.u_prev = [];

        this.v = [];
        this.v_prev = [];
        
        var i;

        for ( i = 0; i < this.size; i += 1) {

            this.u_prev[i] = this.v_prev[i] = this.u[i] = this.v[i] = 0;
            this.r[i] = this.g[i] = this.bl[i] = this.r_prev[i] = this.g_prev[i] = this.bl_prev[i] = 0;

        }

    };

    // Resolution bounder and resetter
    this.setResolution = function ( hRes, wRes ) {

        var res = wRes * hRes;

        if (res > 0 && res < 1000000 && (wRes !== this.width || hRes !== this.height)) {

            this.width = wRes;
            this.height = hRes;

            this.reset();

            return true;

        }
        
        return false;

    };

    // Store the alpha blending data in a unsigned array
    this.buffer = null;
    this.bufferData = null;
    this.clampData = false;
    
    this.canvas = canvas;
    
    // First run to generate alpha blending array
    this.prepareBuffer = function() {
        
        // Check bounds/existance between blending data and simulation field
        if ( this.buffer && this.buffer.width === this.width && this.buffer.height === this.height ) {
        
            return;

        }
        
        // Else create this.buffer array    
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.width;
        this.buffer.height = this.height;
        
        var context = this.buffer.getContext("2d"),
            max,
            i;
        
        try {
            
            // Try to fill up using helper function
            this.bufferData = context.createImageData( this.width, this.height );
            
        } catch(e) {
            
            return null;
            
        }
        
        // Return for non-existant canvas
        if (!this.bufferData) {
        
            return null;

        }
            
        // Generate over square this.buffer array (r,b,g,a)
        max = this.width * this.height * 4;

        for ( i = 3; i < max; i += 4 ){
            
            // Set all alpha values to maximium opacity
            this.bufferData.data[i] = 255;
    
        }            
            
        this.bufferData.data[0] = 256;
        
        if (this.bufferData.data[0] > 255) {
        
            this.clampData = true;

        }            
            
        this.bufferData.data[0] = 0;

    };

    this.displayDensity = function() {
        
        // Continously buffer data to reduce computation overhead
        this.prepareBuffer();
        
        var context = canvas.getContext("2d"),
            data,
            dlength,
            index,
            RGB,
            x,
            d,
            y;            
            
        // Stop using global variables - add accessors
        // ball.vy += this.getYVelocity(Math.round( ball.x ), Math.round( ball.y ) ) / 7;
        // ball.vx += this.getXVelocity(Math.round( ball.x ), Math.round( ball.y ) ) / 7;

        if (this.bufferData) {
            
            // Decouple from pixels to reduce overhead
            data = this.bufferData.data;
            dlength = this.data.length;
            
            if ( this.clampData ) {
                
                for ( x = 0; x < this.width; x += 1 ) {
                    
                    for ( y = 0; y < this.height; y += 1 ) {
                        
                        d = this.getDensity(x, y) * 255 / 5;
                        
                        d = d || 0;
                        
                        if ( d > 255 ) {
                        
                            d = 255;

                        }
                            
                        data[ 4 * ( y * this.height + x ) + 1] = d;
                        
                    }
                    
                }
                
            } else {

                for ( x = 0; x < this.width; x += 1 ) {


                    for ( y = 0; y < this.height; y += 1 ) {

                        index = 4 * (y * this.height +  x);
                        RGB = this.getDensityRGB(x, y);                        

                        data[index] = Math.round( RGB[0] * 255 / 5 );
                        data[index+1] = Math.round( RGB[1] * 255 / 5 );
                        data[index+2] = Math.round( RGB[2] * 255 / 5 );

                    }
                        
                }
                
            }

            context.putImageData(this.bufferData, 0, 0);
            
            } else {
                
                for ( x = 0; x < this.width; x += 1 ) {
                    
                    for ( y = 0; y < this.height; y += 1 ) {
                        
                        d = this.getDensity(x, y) / 5;
                        
                        context.setFillColor(0, d, 0, 1);
                        context.fillRect(x, y, 1, 1);
                        
                    }
                    
                }
                
            }
        
        };

    };

}
