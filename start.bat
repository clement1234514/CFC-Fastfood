@echo off
echo.
echo  ========================================
echo    CFC Cameroon - Fast Food Platform
echo  ========================================
echo    Structure: Frontend ^| Backend ^| Database
echo  ========================================
echo.

echo [1/3] Verification de la base de donnees...
if not exist "%~dp0database\cfc.db" (
  echo   Premiere initialisation en cours...
  cd /d "%~dp0database" && npm install >nul 2>&1 && node seed.js
) else (
  echo   Base de donnees trouvee
)
echo.

echo [2/3] Demarrage du backend (port 5000)...
start "CFC Backend" cmd /c "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo [3/3] Demarrage du frontend (port 3000)...
start "CFC Frontend" cmd /c "cd /d %~dp0frontend && npx next dev -p 3000"

echo.
echo  ========================================
echo   URLs:
echo   Backend API:  http://localhost:5000
echo   Site Web:     http://localhost:3000
echo   Admin:        http://localhost:3000/admin
echo.
echo   Comptes de test:
echo   Admin:  677000000 / admin123
echo   Client: 699000000 / client123
echo   Livreur: 655000000 / livreur123
echo  ========================================
echo.
