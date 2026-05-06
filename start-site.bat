@echo off
title Parfumerie Les 2 As - Dev Server
cd /d "%~dp0"
echo.
echo ====================================
echo   Parfumerie Les 2 As - Dev Server
echo ====================================
echo.
echo Lancement du serveur...
echo Le site s'ouvrira automatiquement dans 5 secondes.
echo Ferme cette fenetre pour arreter le serveur.
echo.
start "" cmd /c "timeout /t 5 /nobreak >nul && start http://localhost:3000/admin/login"
call npm run dev
pause
