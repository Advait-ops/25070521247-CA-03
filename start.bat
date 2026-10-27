@echo off
echo ===================================================
echo Starting Medilife General Hospital Web App...
echo ===================================================
cd /d "%~dp0"

IF NOT EXIST "node_modules" (
    echo Installing dependencies...
    call npm.cmd install
)

echo Starting server on http://localhost:3000 ...
start "" http://localhost:3000
call npm.cmd run dev
pause
