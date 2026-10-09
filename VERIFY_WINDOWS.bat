@echo off
setlocal
cd /d "%~dp0"
call npm install
if errorlevel 1 goto failed
call npm run setup
if errorlevel 1 goto failed
call npm run verify
if errorlevel 1 goto failed
call npm run test:install
if errorlevel 1 goto failed
call npm run test:e2e
if errorlevel 1 goto failed
echo All configured checks passed. OAuth and deployed-domain checks remain manual.
pause
exit /b 0
:failed
echo Verification failed. Read the error above and docsTESTING.md.
pause
exit /b 1
