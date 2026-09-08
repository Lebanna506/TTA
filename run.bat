@echo off
setlocal

cd /d "%~dp0"

echo === Third Age Tracker ===
echo Running from: %CD%
echo.

if not exist "%CD%\package.json" (
    echo [!] Could not find package.json in this folder.
    echo     This usually means run.bat was launched from somewhere other than
    echo     the cloned TTA repo folder - e.g. a shortcut, or a stray copy of
    echo     run.bat sitting outside the repo.
    echo.
    echo     In PowerShell, make sure you run it as:  .\run.bat
    echo     ^(a bare "run.bat" can pick up an unrelated file on your PATH^)
    echo.
    pause
    exit /b 1
)

where git >nul 2>nul
if %errorlevel%==0 (
    if exist "%CD%\.git" (
        rem Stops git's auto-gc from pruning loose-object folders after pull,
        rem which is what triggers the "Deletion of directory ... failed"
        rem prompt when antivirus briefly locks a file mid-delete.
        git config gc.auto 0 >nul 2>nul
        echo Pulling latest changes...
        git pull
        echo.
    ) else (
        echo [!] This folder is not a git repository - skipping pull.
        echo.
    )
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

netstat -ano | findstr /R /C:"LISTENING" | findstr ":8080 " >nul
if %errorlevel%==0 (
    echo Port 8080 is already in use - most likely an earlier run.bat window
    echo that's still open. That server is still serving your latest files,
    echo so just reopening your browser instead of starting a new one.
    echo.
    echo ^(If that's not it, close whatever else is using port 8080 and
    echo  re-run this script.^)
    start http://localhost:8080
    pause
    exit /b 0
)

echo Starting local server at http://localhost:8080 ...
echo (Your data stays in this browser only - close this window to stop.)
echo.
call npm start

pause
