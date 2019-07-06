#!/bin/sh

docker run --rm --name titan-ccp-frontend --network host -e "CONFIGURATION_BASE_URL=http://localhost:8082" -e "HISTORY_BASE_URL=http://localhost:8081" -e "STATS_BASE_URL=http://localhost:8083" industrialdevops/titan-ccp-frontend