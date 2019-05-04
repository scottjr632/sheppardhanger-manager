#!/usr/bin/env python3

import argparse
import os
import sys
import signal
import subprocess

parser = argparse.ArgumentParser(description=r"""
Starts the application with all known dependecies.

This script will serve differently with different arguments.
Using the --dev argument will start in dev server mode.
Using the --prod argument will start in production server mode.

The suprocesses that are started are the flask server in dev mode
or the gunicorn server in production mode. The stock-microsrvc
service is also started in all modes.

""")

# Check that we're in the proper directory
cwd = os.getcwd()
ROOT = cwd
# else:
#     raise Exception("Script must be called from the root or script directory")

# set process group and globals

os.setpgrp()

SCRIPTS = os.path.join(ROOT, 'scripts')
PID_FILE_PATH = os.path.join(ROOT, 'var/run-dev.pid')

cmds = []    # ALL COMMANDS IN ARRAY WILL BE RAN BY A SUBPROCESS
funcs = []   # ALL FUNCTIONS IN ARRAY WILL BE RAN BY AFTER SUBPROCESSES START

# handle all file system level tasks

if not os.path.exists(os.path.dirname(PID_FILE_PATH)):
    os.makedirs(os.path.dirname(PID_FILE_PATH))

with open(PID_FILE_PATH, 'w+') as file:
    file.write(str(os.getpgrp()) + '\n')

# ------------------------ ACTIONS --------------------------------------------


def start_dev_flask():
    from dotenv import load_dotenv
    load_dotenv()

    print(os.environ.get('DATABASE_URL'))

    from app import create_app

    app = create_app(serve_client=True)

    app.run(host='0.0.0.0', threaded=True)


def start_prod():
    from dotenv import load_dotenv
    load_dotenv()

    cpu_count = (2 * 2) + 1

    action = [
        'gunicorn', '--worker-connections=1000',
        '--workers={}'.format(cpu_count), '--log-level=info', 'wsgi'
    ]

    cmds.append(action)


def start_client():
    from dotenv import load_dotenv
    load_dotenv()

    action = ['npm', '--prefix', ROOT+'/client', 'run', 'start']
    cmds.append(action)


def start_dev():
    from dotenv import load_dotenv
    load_dotenv()

    # start flask server

    action = ['npm', '--prefix', ROOT+'/client', 'run', 'start']
    cmds.append(action)

    funcs.append(start_dev_flask)


def start_celery():
    from dotenv import load_dotenv
    load_dotenv()

    action = ['celery', '-A', 'celery_worker.celery', 'worker', '--loglevel=info']
    cmds.append(action)


def initdb():
    pass


ACTIONS = {
    "startclient" : start_client,
    "startserver" : start_dev_flask,
    "startprod" : start_prod,
    "rundev" : start_dev,
    "celery" : start_celery,
}

# ------------------------ COMMAND LINE ARGS ----------------------------------

parser.add_argument('action',
                    help='start the Flask app',
                    type=str,
                    choices=[key for key, v in ACTIONS.items()])

parser.add_argument('--dev',
                    action='store_true',
                    help='Use in development mode.',
                    default=False)

parser.add_argument('--prod',
                    action='store_true',
                    help='Use production server mode.',
                    default=False)

parser.add_argument('--cleandb',
                    action='store_true',
                    help='clean the database',
                    default=False)

parser.add_argument('--initdb',
                    action='store_true',
                    help='clean the database',
                    default=False)


options = parser.parse_args()


# set environment variables for processes
envs = {}

if options.dev:
    envs = {
        'REDIS_URL': 'redis://localhost/0',
        'DATABASE_URL' : 'postgresql://localhost:5432/'
    }

# handle signals

def signal_handler(sig, frame):
    os.killpg(0, signal.SIGTERM)
    os.remove(PID_FILE_PATH)
    sys.exit(0)


def main():

    if options.initdb or options.cleandb:
        initdb()

    action = ACTIONS.get(options.action)
    action()

    ENV = os.environ.copy()
    for key, value in envs.items():
        ENV[key] = value

    # extra commands
    for cmd in cmds:
        subprocess.Popen(cmd, env=ENV)

    for func in funcs:
        subprocess.Popen(func(), env=ENV)


if __name__ == '__main__':
    for s in (signal.SIGINT, signal.SIGTERM):
        signal.signal(s, signal_handler)

    main()
    signal.pause()
