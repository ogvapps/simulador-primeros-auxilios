@echo off
echo ===========================================
echo       CREANDO SIMULADOR EDUCACION FISICA
echo ===========================================

set SOURCE_DIR=%CD%
set DEST_DIR=..\simulador-ef

if exist "%DEST_DIR%" (
    echo [AVISO] La carpeta destino ya existe. Se sobrescribiran archivos.
) else (
    echo [INFO] Creando carpeta destino...
    mkdir "%DEST_DIR%"
)

echo.
echo [1/3] Clonando proyecto (esto puede tardar un poco)...
robocopy "%SOURCE_DIR%" "%DEST_DIR%" /E /XD node_modules .git .gemini .next dist /NFL /NDL /NJH /NJS
if %ERRORLEVEL% GEQ 8 (
    echo [ERROR] Hubo un problema al copiar los archivos.
    pause
    exit /b
)

echo.
echo [2/3] Aplicando contenido de Educacion Fisica...
move /Y "%DEST_DIR%\constants_EF.temp.jsx" "%DEST_DIR%\src\data\constants.jsx" > nul

echo.
echo [3/3] Limpiando archivos temporales...
del "%SOURCE_DIR%\constants_EF.temp.jsx" 2>nul

echo.
echo ===========================================
echo            ¡PROCESO COMPLETADO!
echo ===========================================
echo.
echo INSTRUCCIONES:
echo 1. Abre VS Code.
echo 2. Ve a Archivo -> Abrir Carpeta.
echo 3. Selecciona la carpeta: simulador-ef
echo 4. Dentro de la nueva carpeta, ejecuta: npm install
echo.
pause
