#!/bin/bash

echo "Running migrations..."
php artisan migrate --force

echo "Starting application..."
exec "$@"