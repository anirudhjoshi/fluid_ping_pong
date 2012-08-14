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

function FluidField(canvas) {

    'use strict';

    // More iterations = much slower simulation (10 is good default)

    var width, height, rowSize, size;

    var iterations = 10;

    var visc = 0.5;
    var dt = 0.1;

    var r = [];
    var r_prev = [];

    var g = [];
    var g_prev = [];

    var bl = [];
    var bl_prev = [];    

    var u = [];
    var u_prev = [];

    var v = [];
    var v_prev = [];

    var width = 0;
    var height = 0;

    var rowSize = 0;
    var size = 0;

    var fadeSpeed = 0.01;
    var holdAmount = 1 - fadeSpeed;

    var displayFunc = null;   

    // Add fields x and s together over dt
    this.addFields = function(x, s, dt) {

        var i;

        for ( i = 0; i < size; i += 1 ) {
            
            x[ i ] += dt * s[ i ];

        }

    };

    // Fluid bounding function over a field for stability
    this.set_bnd = function(b, x) {

        var i, j, maxEdge;


        if ( b === 1 ) {

            for ( i = 1; i <= width; i += 1 ) {

                x[i] = x[i + rowSize];
                x[i + (height + 1) * rowSize] = x[i + height * rowSize];

            }

            for (j = 1; i <= height; i += 1) {

                x[j * rowSize] = -1 * x[1 + j * rowSize]; //jslint - gurantee neg
                x[(width + 1) + j * rowSize] = -1*x[width + j * rowSize]; //jslint - gurantee neg

            }

        } else if (b === 2) {
            for ( i = 1; i <= width; i  += 1) {
                x[i] = -1 * x[i + rowSize]; //jslint - gurantee neg
                x[i + (height + 1) * rowSize] = -1 * x[i + height * rowSize]; //jslint - gurantee neg
            }

            for ( j = 1; j <= height; j += 1) {
                x[j * rowSize] =  x[1 + j * rowSize];
                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
            }
        } else {
            for ( i = 1; i <= width; i  += 1) {
                x[i] =  x[i + rowSize];
                x[i + (height + 1) * rowSize] = x[i + height * rowSize];
            }

            for ( j = 1; j <= height; j  += 1) {
                x[j * rowSize] =  x[1 + j * rowSize];
                x[(width + 1) + j * rowSize] =  x[width + j * rowSize];
            }
        }

        maxEdge = (height + 1) * rowSize;

        x[ 0 ]                 = 0.5 * ( x[ 1 ] + x[ rowSize ] );
        x[ maxEdge ]           = 0.5 * (x[1 + maxEdge] + x[height * rowSize]);
        x[ ( width + 1 ) ]         = 0.5 * (x[width] + x[(width + 1) + rowSize]);
        x[ ( width + 1) + maxEdge ] = 0.5 * (x[width + maxEdge] + x[(width + 1) + height * rowSize]);

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

            for ( j=1 ; j<=height; j += 1) {

                currentRow = j * rowSize;

                currentRow += 1;

                for ( i = 0; i < width; i  += 1) {

                    x[currentRow] = x0[currentRow];
                    currentRow += 1;

                }
            }

            this.set_bnd(b, x);

        } else {

            invC = 1 / c;

            for (k=0 ; k<iterations; k  += 1) {

                for (j=1 ; j<=height; j  += 1) {

                    lastRow = (j - 1) * rowSize;
                    currentRow = j * rowSize;
                    nextRow = (j + 1) * rowSize;
                    lastX = x[currentRow];

                    currentRow += 1;

                    for (i=1; i<=width; i  += 1) {

                        currentRow += 1;
                        lastRow += 1;
                        nextRow += 1;

                        lastX = x[currentRow - 1] = (x0[currentRow - 1] + a*(lastX+x[currentRow]+x[lastRow]+x[nextRow])) * invC;

                    }   

                }

                this.set_bnd(b, x);                

            }

        }

    };

    // Fades out velocities/densities to stop full stability
    // MSAFluidSolver2d.java
    this.fade = function(x) {

        var i;

        for ( i = 0; i < size; i += 1) {

            // fade out
            x[i] *= holdAmount;

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
            invC,
            currentRow,
            lastRow,
            nextRow,
            lastX,
            lastY;

        if (a === 0 && c === 1) {
            for ( j=1 ; j <= height; j += 1) {

                 currentRow = j * rowSize;

                currentRow += 1;
                
                for ( i = 0; i < width; i += 1) {

                    x[currentRow] = x0[currentRow];
                    y[currentRow] = y0[currentRow];
                    currentRow += 1;

                }

            }

            this.set_bnd(1, x);
            this.set_bnd(2, y);

        } else {

            invC = 1/c;

            for (k=0 ; k<iterations; k += 1) {

                for (j=1 ; j <= height; j += 1) {

                    lastRow = (j - 1) * rowSize;
                    currentRow = j * rowSize;
                    nextRow = (j + 1) * rowSize;
                    lastX = x[currentRow];
                    lastY = y[currentRow];

                    currentRow += 1;

                    for (i = 1; i <= width; i += 1) {

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
    
        var Wdt0 = dt * width;
        var Hdt0 = dt * height;
        var Wp5 = width + 0.5;
        var Hp5 = height + 0.5;
        for (var j = 1; j<= height; j++) {
            var pos = j * rowSize;
            for (var i = 1; i <= width; i++) {
                var x = i - Wdt0 * u[++pos]; 
                var y = j - Hdt0 * v[pos];
                if (x < 0.5)
                    x = 0.5;
                else if (x > Wp5)
                    x = Wp5;
                var i0 = x | 0;
                var i1 = i0 + 1;
                if (y < 0.5)
                    y = 0.5;
                else if (y > Hp5)
                    y = Hp5;
                var j0 = y | 0;
                var j1 = j0 + 1;
                var s1 = x - i0;
                var s0 = 1 - s1;
                var t1 = y - j0;
                var t0 = 1 - t1;
                var row1 = j0 * rowSize;
                var row2 = j1 * rowSize;
                d[pos] = s0 * (t0 * d0[i0 + row1] + t1 * d0[i0 + row2]) + s1 * (t0 * d0[i1 + row1] + t1 * d0[i1 + row2]);
            }
        }

        this.set_bnd(b, d);    

    };
    
    this.project = function(u, v, p, div) {

        var h = -0.5 / Math.sqrt(width * height),
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

        for (j = 1 ; j <= height; j += 1 ) {
            row = j * rowSize;
            previousRow = (j - 1) * rowSize;
            prevValue = row - 1;
            currentRow = row;
            nextValue = row + 1;
            nextRow = (j + 1) * rowSize;
            for (i = 1; i <= width; i += 1 ) {

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

        wScale = 0.5 * width;
        hScale = 0.5 * height;

        for (j = 1; j<= height; j += 1 ) {

            prevPos = j * rowSize - 1;
            currentPos = j * rowSize;
            nextPos = j * rowSize + 1;
            prevRow = (j - 1) * rowSize;
            currentRow = j * rowSize;
            nextRow = (j + 1) * rowSize;

            for (i = 1; i<= width; i += 1) {

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
        this.fade( r );
        this.fade( g );
        this.fade( bl );

        this.fade( u );
        this.fade( v );        

        // Combine old and new fields into the new field
        this.addFields( r, r_prev, dt);
        this.addFields( g, g_prev, dt);
        this.addFields( bl, bl_prev, dt);

        // Diffuse over old and new new field
        this.diffuse(0, r_prev, r );
        this.diffuse(0, g_prev, g );
        this.diffuse(0, bl_prev, bl );

        // Combine vectors into a forward vector model
        this.advect(0, r, r_prev, u, v, dt );
        this.advect(0, g, g_prev, u, v, dt );
        this.advect(0, bl, bl_prev, u, v, dt );

    };
    
    // Move vector fields (u,v) forward over dt
    vel_step = function() {

        var temp;

        this.addFields(u, u_prev, dt );
        this.addFields(v, v_prev, dt );
        
        temp = u_prev; u_prev = u; u = temp;
        temp = v_prev; v_prev = v; v = temp;
        
        this.diffuse2(u, u_prev,v,v_prev, dt);
        this.project(u, v, u_prev, v_prev);
        
        temp = u_prev; u_prev = u; u = temp; 
        temp = v_prev; v_prev = v; v = temp;
        
        this.advect(1, u, u_prev, u_prev, v_prev, dt);
        this.advect(2, v, v_prev, u_prev, v_prev, dt);
        
        this.project(u, v, u_prev, v_prev );

    };

    this.displayFunc = null;

    function Field(r, g, bl, u, v) {

        // Just exposing the fields here rather than using accessors is a measurable win during display (maybe 5%)
        // but makes the code ugly.
        this.setDensityRGB = function(x, y, d) {

             r[(x + 1) + (y + 1) * rowSize] = d[0];
             g[(x + 1) + (y + 1) * rowSize] = d[1];
             bl[(x + 1) + (y + 1) * rowSize] = d[2];

             return;

        }

        getDensityRGB = function(x, y) {

             var r_dens = r[(x + 1) + (y + 1) * rowSize];
             var g_dens = g[(x + 1) + (y + 1) * rowSize];
             var bl_dens = bl[(x + 1) + (y + 1) * rowSize];

             return [ r_dens, g_dens, bl_dens ];

        }        

        this.setVelocity = function(x, y, xv, yv) {

             u[(x + 1) + (y + 1) * rowSize] = xv;
             v[(x + 1) + (y + 1) * rowSize] = yv;

             return;

        }

        //MSAFluidSolver2d.java
        this.setVelocityInterp = function( x, y, vx, vy ) {

            var colSize = rowSize;

            rI = x + 2;
            rJ = y + 2;

            i1 = (x + 2);
            i2 = (rI - i1 < 0) ? (x + 3) : (x + 1);

            j1 = (y + 2);
            j2 = (rJ - j1 < 0) ? (y  + 3) : (y + 1);
            
            diffx = (1-(rI-i1));
            diffy = (1-(rJ-j1));
            
            vx1 = vx * diffx*diffy;
            vy1 = vy * diffy*diffx;
            
            vx2 = vx * (1-diffx)*diffy;
            vy2 = vy * diffy*(1-diffx);
            
            vx3 = vx * diffx*(1-diffy);
            vy3 = vy * (1-diffy)*diffx;
            
            vx4 = vx * (1-diffx)*(1-diffy);
            vy4 = vy * (1-diffy)*(1-diffx);
            
            if(i1<2 || i1>rowSize-1 || j1<2 || j1>colSize-1) return;

            this.setVelocity(i1, j1, vx1, vy1);
            this.setVelocity(i2, j1, vx2, vy2);
            this.setVelocity(i1, j2, vx3, vy3);
            this.setVelocity(i2, j2, vx4, vy4);

            return;

        }         


        getXVelocity = function(x, y) {

             var x_vel = u[(x + 1) + (y + 1) * rowSize];

             return x_vel;

        }
        
        getYVelocity = function(x, y) {

             var y_vel = v[(x + 1) + (y + 1) * rowSize];

             return y_vel;

        }

        width = function() { return width; }
        height = function() { return height; }

    }    


    function queryUI( r, g, bl, u, v ) {

        for ( var i = 0; i < size; i++ )

            r[ i ] = g[i] = bl[i] = 0.0;

        // u[ i ] = v[ i ] = - figure out better way!
        // console.log( r[0] );
        uiCallback( new Field( r, g, bl, u, v ) );
        // console.log( new Field( r, g, bl, u, v ) );

    };

    var uiCallback;

    this.setUICallback = function( callback ) {
        
        uiCallback = callback;

    };

    // Push simulation forward one step
    update = function () {

        queryUI(r_prev, g_prev, bl_prev, u_prev, v_prev);       

        // Move vector fields forward
        // u, v, u_prev, v_prev, dt
        vel_step();

        // console.log( r[0] );

        // Move dye intensity forward
        // dens_step(dens, dens_prev, u, v, dt);
        if ( u_prev ){

            //r_prev, g_prev, bl_prev, u_prev, v_prev, r, g, bl, u, v, dt 
            this.dens_step();
            // console.log( r[0] );

        }

        // Display/Return new density and vector fields
        // new Field(r, g, bl, u, v)
        // this.displayFunc();
        this.displayDensity(new Field( r, g, bl, u, v ) );
        // this.displayVelocity();

    };

    this.setDisplayFunction = function( func ) {

        this.displayFunc = func;

    };

    // Iteration setter and capper
    this.setIterations = function( iters ) {

        if ( iters > 0 && iters <= 100 ){

           iterations = iters;

        }           

    };

    reset = function() {

        rowSize = width + 2;
        size = (width+2)*(height+2);

        width = width;
        height = height;
        size = size;
        rowSize = rowSize;

        r = [];
        r_prev = [];

        g = [];
        g_prev = [];

        bl = [];
        bl_prev = [];

        u = [];
        u_prev = [];

        v = [];
        v_prev = [];
        
        var i;

        for ( i = 0; i < size; i += 1) {

            u_prev[i] = v_prev[i] = u[i] = v[i] = 0;
            r[i] = g[i] = bl[i] = r_prev[i] = g_prev[i] = bl_prev[i] = 0;

        }


    };

    // Resolution bounder and resetter
    this.setResolution = function ( hRes, wRes ) {

        var res = wRes * hRes;

        if (res > 0 && res < 1000000 && (wRes !== width || hRes !== height)) {

            width = wRes;
            height = hRes;

            reset();

            return true;

        }
        
        return false;

    };

    // Store the alpha blending data in a unsigned array
    var buffer = null;
    var bufferData = null;
    var clampData = false;
    
    var canvas = canvas;
    
    // First run to generate alpha blending array
    this.prepareBuffer = function() {
        
        // Check bounds/existance between blending data and simulation field
        if ( buffer && buffer.width === width && buffer.height === height ) {
        
            return;

        }
        
        // Else create buffer array    
        buffer = document.createElement("canvas");
        buffer.width = width;
        buffer.height = height;
        
        var context = buffer.getContext("2d"),
            max,
            i;
        
        try {
            
            // Try to fill up using helper function
            bufferData = context.createImageData( width, height );
            
        } catch(e) {
            
            return null;
            
        }
        
        // Return for non-existant canvas
        if (!bufferData) {
        
            return null;

        }
            
        // Generate over square buffer array (r,b,g,a)
        max = width * height * 4;

        for ( i = 3; i < max; i += 4 ){
            
            // Set all alpha values to maximium opacity
            bufferData.data[i] = 255;
    
        }            
            
        bufferData.data[0] = 256;
        
        if (bufferData.data[0] > 255) {
        
            clampData = true;

        }            
            
        bufferData.data[0] = 0;

    };

    this.displayDensity = function(field) {

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
        // ball.vy += getYVelocity(Math.round( ball.x ), Math.round( ball.y ) ) / 7;
        // ball.vx += getXVelocity(Math.round( ball.x ), Math.round( ball.y ) ) / 7;

        if (bufferData) {

            // Decouple from pixels to reduce overhead
            data = bufferData.data;
            dlength = data.length;

            if ( clampData ) {

                for ( x = 0; x < width; x += 1 ) {

                    for ( y = 0; y < height; y += 1 ) {

                        d = getDensity(x, y) * 255 / 5;

                        d = d || 0;

                        if ( d > 255 ) {

                            d = 255;

                        }

                        data[ 4 * ( y * height + x ) + 1] = d;

                    }

                }

            } else {

                    for ( x = 0; x < width; x += 1 ) {


                        for ( y = 0; y < height; y += 1 ) {

                        index = 4 * (y * height +  x);
                        RGB = field.getDensityRGB(x, y);                        

                        data[index] = Math.round( RGB[0] * 255 / 5 );
                        data[index+1] = Math.round( RGB[1] * 255 / 5 );
                        data[index+2] = Math.round( RGB[2] * 255 / 5 );

                        }

                }

            }   

            context.putImageData(bufferData, 0, 0);

        } else {

            for ( x = 0; x < width; x += 1 ) {

                for ( y = 0; y < height; y += 1 ) {

                d = getDensity(x, y) / 5;

                context.setFillColor(0, d, 0, 1);
                context.fillRect(x, y, 1, 1);

                }

            }

        }

    };

    this.displayVelocity = function() {
        
        var context = canvas.getContext("2d");
        
        context.save();
        context.lineWidth = 1;
        
        var wScale = canvas.width / width;
        var hScale = canvas.height / height;
        
        context.fillStyle="black";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.strokeStyle = "rgb(0,255,0)";
        
        var vectorScale = 10;
        
        context.beginPath();

        // console.log(getXVelocity(10, 10));
        
        for (var x = 0; x < width; x++) {
            
            for (var y = 0; y < height; y++) {
                
                context.moveTo(x * wScale + 0.5 * wScale, y * hScale + 0.5 * hScale);
                context.lineTo((x + 0.5 + vectorScale * getXVelocity(x, y)) * wScale, 
                               (y + 0.5 + vectorScale * getYVelocity(x, y)) * hScale);
                               
            }
            
        }
        
        context.stroke();
        context.restore();
        
    }    

}

// (function (){

//     'use strict';    

//     if ( this.CanvasRenderingContext2D && !CanvasRenderingContext2D.createImageData ) {
    
//     // Grabber helper function
//     CanvasRenderingContext2D.prototype.createImageData = function ( w, h ) {
        
//         return getImageData( 0, 0, w, h);
        
//     };
    
// }

// }());