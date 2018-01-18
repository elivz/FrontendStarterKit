#!/bin/bash

# Pull Database
#
# Pull remote database down from a remote and restore it to local
# Loosely based on craft-scripts by nystudio107

GREEN=`tput setaf 2`
RESET=`tput sgr0`

# Get the directory of the current script
DIR="$(dirname "${BASH_SOURCE[0]}")"

# Load environmental variables
source "${DIR}/../.env"

# Build the remote mysql credentials
REMOTE_DB_CREDS=""
if [ "${REMOTE_DB_USER}" != "" ] ; then
    REMOTE_DB_CREDS+="--user=${REMOTE_DB_USER} "
fi
if [ "${REMOTE_DB_PASS}" != "" ] ; then
    REMOTE_DB_CREDS+="--password=${REMOTE_DB_PASS} "
fi
if [ "${REMOTE_DB_HOST}" != "" ] ; then
    REMOTE_DB_CREDS+="--host=${REMOTE_DB_HOST} "
fi
if [ "${REMOTE_DB_PORT}" != "" ] ; then
    REMOTE_DB_CREDS+="--port=${REMOTE_DB_PORT} "
fi
REMOTE_DB_CREDS+="${REMOTE_DB_NAME}"

# Build the local mysql credentials
LOCAL_DB_CREDS=""
if [ "${DB_USER}" != "" ] ; then
    LOCAL_DB_CREDS+="--user=${DB_USER} "
fi
if [ "${DB_PASS}" != "" ] ; then
    LOCAL_DB_CREDS+="--password=${DB_PASS} "
fi
if [ "${DB_HOST}" != "" ] ; then
    LOCAL_DB_CREDS+="--host=${DB_HOST} "
fi
if [ "${DB_PORT}" != "" ] ; then
    LOCAL_DB_CREDS+="--port=${DB_PORT} "
fi
LOCAL_DB_CREDS+="${DB_NAME}"

# Database commands
LOCAL_MYSQL_CMD="docker exec -i config_db_1 mysql"
LOCAL_MYSQLDUMP_CMD="mysqldump"
REMOTE_MYSQLDUMP_CMD="docker exec -i config_db_1 mysqldump"

# Additional mysqldump arguments
MYSQLDUMP_ARGS="--single-transaction --routines --triggers --events --add-drop-database "

# Temporary db dump path (remote & local)
TMP_DB_PATH="/tmp/${REMOTE_DB_NAME}-db-dump-$(date '+%Y%m%d').sql"
BACKUP_DB_PATH="/tmp/${LOCAL_DB_NAME}-db-backup-$(date '+%Y%m%d').sql"

# Get the remote db dump
ssh $REMOTE_SSH_LOGIN -p $REMOTE_SSH_PORT "$LOCAL_MYSQLDUMP_CMD $REMOTE_DB_CREDS $MYSQLDUMP_ARGS > '$TMP_DB_PATH'"
scp -C -P $REMOTE_SSH_PORT -- $REMOTE_SSH_LOGIN:"${TMP_DB_PATH}" "${TMP_DB_PATH}"
echo "Downloaded remote database to ${TMP_DB_PATH}"

# Backup the local db
$REMOTE_MYSQLDUMP_CMD $LOCAL_DB_CREDS $MYSQLDUMP_ARGS > "$BACKUP_DB_PATH"
gzip -f "$BACKUP_DB_PATH"
echo "Backed up local database to ${BACKUP_DB_PATH}"

# Restore the local db from the remote db dump
sed -i -e "s,${REMOTE_BASE_URL},${BASE_URL},g" $TMP_DB_PATH
$LOCAL_MYSQL_CMD $LOCAL_DB_CREDS < $TMP_DB_PATH
echo "✅  ${GREEN} Finished copying remote database to local ${RESET}"

# Normal exit
exit 0
