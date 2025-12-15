#!/bin/bash
root="src/features/"
feature=$1
if [ $feature == "" ]
then
    echo "Failed to start feature"
else
    mkdir $root$feature
    touch "$root$feature/url_config.jsx"
fi