@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.13 or newer, then run this file again.
  pause
  exit /b 1
)
call npm install
if errorlevel 1 goto failed
call npm run setup
if errorlevel 1 goto failed
call npm run check:db
if errorlevel 1 (
  echo Start MongoDB, or run npm run db:start with Docker Desktop running.
  echo For Atlas, update MONGODB_URI in .env.local. Then launch this file again.
  pause
  exit /b 1
)
echo Open http://localhost:3000 after the server starts.
call npm run dev
exit /b %errorlevel%
:failed
echo Setup did not finish. Read the error above; no success is being assumed.
pause
exit /b 1
