#!/usr/bin/env sh
set -e

# exec gunicorn --worker-connections=1000 --workers=9 --log-level=warning wsgi

/usr/bin/env python3 /shmanager/main.py $1
