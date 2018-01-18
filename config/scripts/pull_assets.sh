#!/usr/bin/env bash

# Pull Assets
#
# Pull remote assets from remote to local
# Loosely based on craft-scripts by nystudio107

GREEN=`tput setaf 2`
RESET=`tput sgr0`

# Get the directory of the current script
DIR="$(dirname "${BASH_SOURCE[0]}")"

# Load environmental variables
source "${DIR}/../.env"

LOCAL_ROOT_PATH="${DIR}/../../dist"

# Pull down the asset dir files via rsync
for DIR in "${ASSETS_PATHS[@]}"
do
    rsync -F -a -z -v -e "ssh -p ${REMOTE_SSH_PORT}" "${REMOTE_SSH_LOGIN}:${REMOTE_ROOT_PATH}${DIR}" "${LOCAL_ROOT_PATH}${DIR%/*}"
    echo "✅  ${GREEN} Downloaded assets from ${REMOTE_ROOT_PATH}${DIR} ${RESET}"
done

# Normal exit
exit 0
