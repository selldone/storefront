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

# Color codes
# shellcheck disable=SC2034
RED='\033[0;31m'
GREEN='\033[0;32m'
# shellcheck disable=SC2034
YELLOW='\033[1;33m'  # Yellow with bold
# shellcheck disable=SC2034
BLUE='\033[0;34m'
# shellcheck disable=SC2034
PURPLE='\033[0;35m'
# shellcheck disable=SC2034
CYAN='\033[0;36m'
# shellcheck disable=SC2034
WHITE='\033[1;37m'  # White with bold
NC='\033[0m' # No Color
GREEN_BOLD='\033[1;32m'
GREEN_Dim='\033[2;32m'
GREEN_INVERT='\033[7;32m'




echo ""
echo "███████╗███████╗██╗     ██╗     ██████╗  ██████╗ ███╗   ██╗███████╗";
echo "██╔════╝██╔════╝██║     ██║     ██╔══██╗██╔═══██╗████╗  ██║██╔════╝";
echo "███████╗█████╗  ██║     ██║     ██║  ██║██║   ██║██╔██╗ ██║█████╗  ";
echo "╚════██║██╔══╝  ██║     ██║     ██║  ██║██║   ██║██║╚██╗██║██╔══╝  ";
echo "███████║███████╗███████╗███████╗██████╔╝╚██████╔╝██║ ╚████║███████╗";
echo "╚══════╝╚══════╝╚══════╝╚══════╝╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚══════╝";
echo ""





# setupSubmodules.sh
echo -e "${GREEN}▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆${NC}"
echo -e "${GREEN_BOLD}⬤ Setup Selldone® Business OS™ Storefront Project ⬤ ${NC}"
echo -e "${GREEN_Dim}The #1 operating system for fast-growing companies.${NC}"
echo -e "${GREEN}▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆▆${NC}"

echo ""

echo -e "${GREEN_INVERT}Checking and adding submodules...${NC}"

# Check and add the 'core' submodule
if [ ! -d "core/.git" ]; then
   echo "Adding 'core' submodule..."
   git submodule add https://github.com/selldone/core core && echo "'core' submodule added successfully." || echo "Failed to add 'core' submodule."
fi

# Check and add the 'components' submodule
if [ ! -d "src/Components/.git" ]; then
   echo "Adding 'components' submodule..."
   git submodule add https://github.com/selldone/components src/Components && echo "'components' submodule added successfully." || echo "Failed to add 'components' submodule."
fi

# Check and add the 'storefront-sdk' submodule
if [ ! -d "SDKs/storefront/.git" ]; then
   echo "Adding 'storefront-sdk' submodule..."
   git submodule add https://github.com/selldone/storefront-sdk SDKs/storefront && echo "'storefront-sdk' submodule added successfully." || echo "Failed to add 'storefront-sdk' submodule."
fi

# Check and add the 'vendor-sdk' submodule
if [ ! -d "SDKs/vendor/.git" ]; then
   echo "Adding 'vendor-sdk' submodule..."
   git submodule add https://github.com/selldone/vendor-sdk SDKs/vendor && echo "'vendor-sdk' submodule added successfully." || echo "Failed to add 'vendor-sdk' submodule."
fi

# Check and add the 'community-sdk' submodule
if [ ! -d "SDKs/community/.git" ]; then
   echo "Adding 'community-sdk' submodule..."
   git submodule add https://github.com/selldone/community-sdk SDKs/community && echo "'community-sdk' submodule added successfully." || echo "Failed to add 'community-sdk' submodule."
fi

# Check and add the 'pagebuilder' submodule
if [ ! -d "src/Applications/PageBuilder/.git" ]; then
   echo "Adding 'pagebuilder' submodule..."
   git submodule add https://github.com/selldone/pagebuilder src/Applications/PageBuilder && echo "'pagebuilder' submodule added successfully." || echo "Failed to add 'pagebuilder' submodule."
fi

echo ""
# Display the status of submodules
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN_INVERT}Displaying submodule status...${NC}"
git submodule status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if tsconfig.json already exists
if [ ! -f "tsconfig.json" ]; then
    # Check if _tsconfig.json exists
    if [ -f "_tsconfig.json" ]; then
        # Rename _tsconfig.json to tsconfig.json
        mv _tsconfig.json tsconfig.json
        echo "File [_tsconfig.json -> tsconfig.json] renamed successfully."
    else
        echo "_tsconfig.json does not exist."
    fi
else
    echo "tsconfig.json already exists."
fi
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

