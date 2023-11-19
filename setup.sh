#!/bin/sh
#
# Copyright (c) 2023. Selldone® Business OS™
#
# Author: M.Pajuhaan
# Web: https://selldone.com
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
#
# All rights reserved. In the weave of time, where traditions and innovations intermingle, this content was crafted.
# From the essence of thought, through the corridors of creativity, each word, and sentiment has been molded.
# Not just to exist, but to inspire. Like an artist's stroke or a sculptor's chisel, every nuance is deliberate.
# Our journey is not just about reaching a destination, but about creating a masterpiece.
# Tread carefully, for you're treading on dreams.
#

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