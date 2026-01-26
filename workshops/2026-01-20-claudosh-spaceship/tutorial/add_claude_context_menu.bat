@echo off
:: Add "Open With Claude Code" to Windows right-click context menu
:: Run this file as Administrator (right-click -> Run as administrator)

echo Adding "Open With Claude Code" to context menu...

:: 1. Right-click ON a folder
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCode" /ve /d "Open With Claude Code" /f
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCode" /v "Icon" /d "powershell.exe" /f
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCode\command" /ve /d "powershell.exe -NoExit -Command \"cd '%V'; claude\"" /f

:: 2. Right-click on empty space INSIDE a folder
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCode" /ve /d "Open With Claude Code" /f
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCode" /v "Icon" /d "powershell.exe" /f
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCode\command" /ve /d "powershell.exe -NoExit -Command \"cd '%V'; claude\"" /f

:: 3. Right-click ON a folder - Admin version
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCodeAdmin" /ve /d "Open With Claude Code (Admin)" /f
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCodeAdmin" /v "Icon" /d "powershell.exe" /f
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCodeAdmin" /v "HasLUAShield" /d "" /f
reg add "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCodeAdmin\command" /ve /d "powershell.exe -Command \"Start-Process powershell -ArgumentList '-NoExit','-Command','cd ''%V''; claude' -Verb RunAs\"" /f

:: 4. Right-click on empty space INSIDE a folder - Admin version
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCodeAdmin" /ve /d "Open With Claude Code (Admin)" /f
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCodeAdmin" /v "Icon" /d "powershell.exe" /f
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCodeAdmin" /v "HasLUAShield" /d "" /f
reg add "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCodeAdmin\command" /ve /d "powershell.exe -Command \"Start-Process powershell -ArgumentList '-NoExit','-Command','cd ''%V''; claude' -Verb RunAs\"" /f

echo.
echo Done! You can now right-click any folder and select "Open With Claude Code"
echo.
pause
