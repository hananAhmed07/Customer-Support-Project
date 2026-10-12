@echo off
title TicketSense Frontend
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;C:\Users\MOHAMED\AppData\Local\Programs\Python\Python313;%PATH%"
echo Starting Next.js Frontend on http://localhost:3000 ...
npm run dev
pause
