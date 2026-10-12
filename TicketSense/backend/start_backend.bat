@echo off
title TicketSense Backend
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;C:\Users\MOHAMED\AppData\Local\Programs\Python\Python313;%PATH%"
echo Starting FastAPI Backend on http://127.0.0.1:8000 ...
python run.py
pause
