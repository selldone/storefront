#!/bin/sh
# setupSubmodules.sh

# Check if the submodule directories are empty
if [ ! -d "core/.git" ]; then
   git submodule add https://github.com/selldone/core core
fi

if [ ! -d "src/Components/.git" ]; then
   git submodule add https://github.com/selldone/components src/Components
fi

if [ ! -d "SDKs/storefront/.git" ]; then
   git submodule add https://github.com/selldone/storefront-sdk SDKs/storefront
fi

if [ ! -d "SDKs/vendor/.git" ]; then
   git submodule add https://github.com/selldone/vendor-sdk SDKs/vendor
fi

if [ ! -d "SDKs/community/.git" ]; then
   git submodule add https://github.com/selldone/community-sdk SDKs/community
fi