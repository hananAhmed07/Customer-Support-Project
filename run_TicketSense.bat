@echo off
title TicketSense Launcher
echo ========================================================
echo        Starting TicketSense Enterprise Support Suite
echo ========================================================
echo.

set "PATH=C:\Program Files\nodejs;C:\Users\MOHAMED\AppData\Local\Programs\Python\Python313;%PATH%"

cd /d "%~dp0TicketSense\backend"
echo [1/2] Starting FastAPI Backend on port 8000...
start "TicketSense Backend (FastAPI)" cmd /k "set PATH=C:\Program Files\nodejs;C:\Users\MOHAMED\AppData\Local\Programs\Python\Python313;%%PATH%% && python run.py"

timeout /t 3 /nobreak >nul

cd /d "%~dp0TicketSense\frontend"
echo [2/2] Starting Next.js Frontend on port 3000...
start "TicketSense Frontend (Next.js)" cmd /k "set PATH=C:\Program Files\nodejs;C:\Users\MOHAMED\AppData\Local\Programs\Python\Python313;%%PATH%% && npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   Services are running!
echo   Frontend URL: http://localhost:3000
echo   Backend API:  http://127.0.0.1:8000/api/docs
echo ========================================================
start http://localhost:3000
