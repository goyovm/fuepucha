#!/bin/bash

sed -i 's|const dev = true;|const dev = false;|g' backend/src/utils/config.ts
cd backend
yarn install
yarn start