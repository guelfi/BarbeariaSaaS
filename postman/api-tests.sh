#!/bin/bash

LOG_FILE="/Users/guelfi/Projetos/BarbeariaSaaS/logs/curl_api_tests.log"

# Ensure the logs directory exists
mkdir -p /Users/guelfi/Projetos/BarbeariaSaaS/logs

# Clear previous log content
> "$LOG_FILE"

echo "Running API curl tests..." | tee -a "$LOG_FILE"
echo "--------------------------" | tee -a "$LOG_FILE"

# Test the login endpoint with valid credentials
echo "\n--- Testing valid admin login ---" | tee -a "$LOG_FILE"
curl -X POST -H "Content-Type: application/json" -d '{"email":"guelfi@msn.com","password":"@5ST73EA4x"}' http://localhost:4004/api/auth/login | tee -a "$LOG_FILE"

# Test the login endpoint with invalid credentials
echo "\n--- Testing invalid password login ---" | tee -a "$LOG_FILE"
curl -X POST -H "Content-Type: application/json" -d '{"email":"guelfi@msn.com","password":"wrongpassword"}' http://localhost:4004/api/auth/login | tee -a "$LOG_FILE"

# Test the login endpoint with a non-existing user
echo "\n--- Testing non-existing user login ---" | tee -a "$LOG_FILE"
curl -X POST -H "Content-Type: application/json" -d '{"email":"nonexisting@user.com","password":"password"}' http://localhost:4004/api/auth/login | tee -a "$LOG_FILE"

echo "\nCurl tests finished. Check $LOG_FILE for details." | tee -a "$LOG_FILE"