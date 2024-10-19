#!/bin/bash
DATE=$(date +"%Y-%m-%d")
SQL_FILE=backup-${DATE}.sql

mariadb -u"${USER}" -p"${PASSWORD}" "${DATABASE}" < "${SQL_FILE}"

# 복원 성공 여부 확인
if [ $? -eq 0 ]; then
    echo "Database restoration completed successfully: ${SQL_FILE}"
else
    echo "Database restoration failed"
fi
