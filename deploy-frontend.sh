#!/bin/bash

sed -i 's|const dev = true;|const dev = false;|g' frontend/src/config/index.ts
cd frontend
yarn install
yarn build