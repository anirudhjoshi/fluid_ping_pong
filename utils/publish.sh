#!bin/sh

./build.sh

cp -r ../build/ ../../

git checkout gh-pages

cp -r ../../build/* ../

rm -rf ../../build/