#!/bin/sh

# Script to wait for db container to be ready
set -e

until pg_isready --host="${DB_HOST}" --username="${DB_USER_FOR_APP}" --port="${DB_PORT}"; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 3
done

>&2 echo "Postgres is up - executing command"
exec $cmd