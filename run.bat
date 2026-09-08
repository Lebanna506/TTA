@echo off
setlocal

cd /d "%~dp0"

echo === Third Age Tracker ===
echo.

where git >nul 2>nul
if %errorlevel%==0 (
    echo Pulling latest changes...
    git pull
    echo.
) else (
    echo [!] git not found on PATH - skipping pull.
    echo.
)

where npm >nul 2>nul
if not %errorlevel%==0 (
    echo [!] Node.js/npm is required but was not found on PATH.
    echo     Install it from https://nodejs.org and re-run this script.
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install
echo.

echo Starting local server at http://localhost:8080 ...
echo (Your data stays in this browser only - close this window to stop.)
echo.
call npm start

pause
