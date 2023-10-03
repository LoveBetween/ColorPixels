// The function gets called when the window is fully loaded

window.onload = function() {
    // Get the canvas and context
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var widthSlider = document.getElementById("width");
    var heightSlider = document.getElementById("height");
    var osSlider = document.getElementById("myRange");
    document.getElementById ("gen").addEventListener ("click", generate, false);
    osSlider.addEventListener ("change", setOffset, false);
    
    // Define the image dimensions
    var width;
    var height;
    var directions = [
        1,-1,
        1,0,
        1,1,
        0,-1,
        0,1,
        -1,-1,
        -1,0,
        -1,1];

    var bitmap;
    var count;
    var running = false;
    var os = osSlider.value;
    var imagedata;
    // Create an ImageData object
    
    function generate(){
        count = 1;
        createImage();
        setup();
        running = true;
        main(0);
    }

    function setOffset(){
        os = (osSlider.value * osSlider.value)/4;
    }
    // Create the image
    function createImage() {
        // Loop over all of the pixels
        for (var x=0; x<width; x++) {
            for (var y=0; y<height; y++) {
                // Get the pixel index
                var pixelindex = (y * width + x) * 4;

                // Set the pixel data
                imagedata.data[pixelindex] += 0;     // Red
                imagedata.data[pixelindex+1] = 0; // Green
                imagedata.data[pixelindex+2] = 0;  // Blue
                imagedata.data[pixelindex+3] = 0;   // Alpha
            }
        }
    }
    function setup(){
        canvas.width = widthSlider.value;
        canvas.height = heightSlider.value;
        console.log
        width = canvas.width;
        height = canvas.height;
        bitmap = Array(height * width *3);
        imagedata =context.createImageData(width, height);
        
        var x = Math.floor(Math.random() * width);
        var y = Math.floor(Math.random() * height);
        
        bitmap[0] = x;
        bitmap[1] = y;
        bitmap[2] = 1;
        
        var index = (y * width + x) * 4;
        imagedata.data[index] +=  Math.floor(Math.random() * 255);  // Red
        imagedata.data[index+1] =  Math.floor(Math.random() * 255); // Green
        imagedata.data[index+2] =  Math.floor(Math.random() * 255); // Blue
        imagedata.data[index+3] = 255;// Apha
        
    }
    function addPixel(index, newIndex, yOffset, xOffset, count){

        imagedata.data[newIndex] = 
        imagedata.data[index] + Math.floor(Math.random() * 2*os) -os;
        imagedata.data[newIndex+1] = 
        imagedata.data[index+1] + Math.floor(Math.random() *  2*os) -os;
        imagedata.data[newIndex+2] = 
        imagedata.data[index+2] + Math.floor(Math.random() *  2*os) -os;
        imagedata.data[newIndex+3] = 255;;
        
        bitmap[count*3] = xOffset;
        bitmap[count*3 +1] = yOffset;
        bitmap[count*3 +2] = 1;
    }
    function genPixel(){
        var z = 0;

        for(var i=0; i< count && (count+z)< (width*height);i++){
            if(bitmap[i*3+2]==1){
                var dir = directions.slice();
                var rdir =[];
                for(var j = 8; j>0;j--){
                    var r = Math.floor(Math.random() * j);
                    rdir.push(dir[r*2]);
                    rdir.push(dir[r*2+1]);
                    dir.splice(r*2,2);
                }
                var x = bitmap[i*3];
                var y = bitmap[i*3+1];
                var index = (y * width + x) * 4;

                var added = false;

                for(var j =0; j<16;j+=2){
                    
                    var xOffset = x + rdir[j];
                    var yOffset = y + rdir[j+1];
                    
                    var newIndex = ( yOffset * width + xOffset ) * 4;
                    
                    if(imagedata.data[newIndex+3] == 0){
                        addPixel(index,newIndex,yOffset,xOffset, count+z)
                        z++;count++;
                        added = true;
                        break;
                    }
                }
                if(!added){
                    bitmap[i*3+2]=0;
                }
            }
        }
    }

    // Main loop
    function main(tframe) {    
        window.requestAnimationFrame(main);
        // Create the image
        genPixel();
        // Draw the image data to the canvas
        context.putImageData(imagedata, 0, 0);
    }

    // Call the main loop
    if(running && count<10000 )main(0);
};