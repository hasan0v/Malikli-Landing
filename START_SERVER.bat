@echo off
echo Starting MALIKLI1992 Website Server...
echo.
echo ===================================
echo MALIKLI1992 WEBSITE LAUNCHER
echo ===================================
echo.
echo This will start a local server for your website.
echo When the server starts, open your browser and go to:
echo.
echo      http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo ===================================
echo.
cd %~dp0
python -m http.server 8000
pause
