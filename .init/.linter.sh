#!/bin/bash
cd /home/kavia/workspace/code-generation/ping-pong-match-manager-129232-129241/ping_pong_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

