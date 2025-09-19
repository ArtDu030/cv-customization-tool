@echo off
title CV Customization Tool
color 0A
cls

echo.
echo  ╔══════════════════════════════════════╗
echo  ║        CV Customization Tool         ║
echo  ╚══════════════════════════════════════╝
echo.

REM Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo  ❌ Node.js not found!
    echo.
    echo  Please install Node.js from: https://nodejs.org
    echo  Then run this file again.
    echo.
    pause
    exit /b 1
)

echo  ✅ Node.js found
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo  📦 Installing dependencies...
    call npm install --silent
    echo  ✅ Dependencies installed
    echo.
)

REM Build if needed
if not exist ".next" (
    echo  🔨 Building application...
    call npm run build --silent
    echo  ✅ Application built
    echo.
)

echo  🚀 Starting CV Tool...
echo.
echo  ╔══════════════════════════════════════╗
echo  ║  Your app will open at:              ║
echo  ║  http://localhost:3000               ║
echo  ╚══════════════════════════════════════╝
echo.
echo  💡 Instructions:
echo     • Your browser will open automatically
echo     • To stop: Close this window
echo.

timeout /t 3 /nobreak >nul
start "" http://localhost:3000
npm run dev