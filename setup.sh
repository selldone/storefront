#!/bin/sh
# setupSubmodules.sh

# Check if the submodule directories are empty
if [ ! -d "core/.git" ]; then
   git submodule add https://github.com/selldone/core core
fi

if [ ! -d "src/Components/.git" ]; then
   git submodule add https://github.com/selldone/components src/Components
fi
