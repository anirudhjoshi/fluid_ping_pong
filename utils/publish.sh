#!/bin/sh

./build.sh

cp -r ../build/ ../../

git checkout gh-pages

cp ../../build/* ../

rm -rf ../../build/

git checkout develop