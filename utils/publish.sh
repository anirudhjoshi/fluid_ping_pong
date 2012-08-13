
#!bin/sh

./build.sh

cp ../build/ ../../build/

git checkout gh-pages

cp ../../build/* ../

rm -rf ../../build/