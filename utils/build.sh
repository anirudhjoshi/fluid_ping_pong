#!/bin/sh

mkdir -p ../build


java -jar compiler.jar --js ../src/js/fluid.js ../src/js/pong.js ../src/js/main.js --js_output_file ../build/f.js
#java -jar compiler.jar --js ../src/js/class_fluid.js ../src/js/pong.js ../src/js/main.js --js_output_file ../build/f.js
java -jar yuicompressor-2.4.7.jar ../src/css/main.css -o ../build/f.css

java -jar htmlcompressor-1.5.3.jar ../src/index.html > ../build/index.html