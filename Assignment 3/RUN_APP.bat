@echo off
TITLE News Aggregator Launcher
COLOR 0A
CLS

echo =========================================================================
echo               📰 NEWS AGGREGATOR DASHBOARD LAUNCHER 📰
echo =========================================================================
echo.

:: 1. Free ports 5000 and 3000 if currently occupied
echo [1/3] Checking and clearing ports 5000 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5000') do (
    echo Killing existing process on port 5000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do (
    echo Killing existing process on port 3000 (PID: %%a)...
    taskkill /F /PID %%a >nul 2>&1
)
echo Ports are clear!
echo.

:: 2. Check if Docker is installed and in PATH
where docker >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [2/3] Docker detected on system.
    echo.
    echo How would you like to run the application?
    echo   [1] Docker Compose (Runs Frontend + Backend in Docker containers)
    echo   [2] Local Node.js (Runs Frontend + Backend via npm start)
    echo.
    set /p choice="Enter option (1 or 2, default is 1): "
    if "%choice%"=="2" goto RUN_LOCAL
    goto RUN_DOCKER
) else (
    echo [2/3] Docker CLI not found on system PATH.
    echo Running automatically in Local Node.js mode...
    echo.
    goto RUN_LOCAL
)

:RUN_DOCKER
echo.
echo =========================================================================
echo 🐳 Launching application with Docker Compose...
echo =========================================================================
echo Running: docker compose up --build
echo.
docker compose up --build
pause
exit /b 0

:RUN_LOCAL
echo.
echo =========================================================================
echo 🚀 Launching Backend & Frontend services locally with Node.js...
echo =========================================================================
echo.

:: Start Backend in separate window
echo Starting Backend API (Port 5000)...
start "News Aggregator Backend (Port 5000)" cmd /k "cd /d %~dp0backend && npm start"

:: Wait 3 seconds for Backend to initialize
timeout /t 3 /nobreak >nul

:: Start Frontend in separate window
echo Starting Frontend React Dashboard (Port 3000)...
start "News Aggregator Frontend (Port 3000)" cmd /k "cd /d %~dp0frontend && npm start"

echo.
echo =========================================================================
echo ✅ Applications starting!
echo 📡 Backend API: http://localhost:5000/news
echo 🌐 Frontend Dashboard: http://localhost:3000
echo =========================================================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak >nul
start http://localhost:3000

pause
