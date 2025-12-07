#!/usr/bin/env bash
# Exit on error
set -o errexit

# Start Gunicorn
gunicorn project.wsgi:application --bind 0.0.0.0:$PORT

