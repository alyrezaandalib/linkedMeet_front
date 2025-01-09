#!/bin/sh

# Check the APP_ENV variable
if [ "$APP_ENV" = "local" ]; then
    echo "Environment is local. Running: npm run dev"
    npm run dev
else
    echo "Environment is production. Running: npm run start"
    npm run start
fi
