Edit Pad - Free Online Text EditorEditpad
+
search on editpad
Chat
Get Premium
Login
AI Detector
Humanize AI Text
Plagiarism Checker
Paraphrasing Tool
Story Generator
Text Summarizer
AI Essay Writer

Upload Icon
Download Icon
Language Icon
Language Caret Icon
Our Blogs
Full Screen Icon
Full Screen

Download Icon
About This Tool

Give Feedback
116 Words
1010 Character
10 Sentence
(Get-Content 'C:\Use
Formatting

New File Icon
New Note
Sidebar Open Icon
SAVED NOTES

(Get-Content 'C:\Use

@echo off
chcp 65001 >nul
color 0A
title Corrector de App.jsx

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║        CORRECTOR AUTOMÁTICO DE ERRORES - App.jsx          ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Buscando el error 'lassName'...
echo.

powershell -Command "$archivo = 'C:\Users\orest\simulador-pas\src\App.jsx'; $contenido = Get-Content $archivo -Raw -Encoding UTF8; if ($contenido -match 'lassName=') { $contenido = $contenido -replace 'lassName=', 'className='; Set-Content $archivo $contenido -NoNewline -Encoding UTF8; Write-Host '✓ Archivo corregido exitosamente' -ForegroundColor Green; Write-Host 'El servidor Vite debería recargar automáticamente' -ForegroundColor Cyan } else { Write-Host '⚠ No se encontró el error lassName en el archivo' -ForegroundColor Yellow; Write-Host 'Puede que ya esté corregido o el error sea otro' -ForegroundColor Yellow }"

echo.
echo Presiona cualquier tecla para cerrar...
pause >nul
