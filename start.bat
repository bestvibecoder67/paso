@echo off
cd /d "%~dp0"
echo.
echo  Paso is running.
echo  On this computer: http://localhost:8000
echo  On a phone on the same Wi-Fi, open one of these:
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do echo     http:/%%a:8000
echo.
echo  Close this window to stop.
py -m http.server 8000 --bind 0.0.0.0
