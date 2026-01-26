@echo off
:: Remove "Open With Claude Code" from Windows right-click context menu
:: Run this file as Administrator (right-click -> Run as administrator)

echo Removing "Open With Claude Code" from context menu...

reg delete "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCode" /f 2>nul
reg delete "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCode" /f 2>nul
reg delete "HKEY_CLASSES_ROOT\Directory\shell\ClaudeCodeAdmin" /f 2>nul
reg delete "HKEY_CLASSES_ROOT\Directory\Background\shell\ClaudeCodeAdmin" /f 2>nul

echo.
echo Done! Context menu entries removed.
echo.
pause
