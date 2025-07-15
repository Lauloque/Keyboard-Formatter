@echo off
setlocal EnableDelayedExpansion

:: Detect whether we run from double-clicking the bat file in the file explorer or from the terminal.
for %%x in (%cmdcmdline%) do if /i "%%~x"=="/c" set DOUBLECLICKED=1

set list=main.js manifest.json styles.css

set output_dir=D:\libraries\ObsidianSandboxVault\.obsidian\plugins\keyboard-formatter
set here=%~dp0

:: Loop through each file in the list and copy it to the output directory
for %%f in (%list%) do (
    copy "!here!%%f" "!output_dir!"
)

if defined DOUBLECLICKED pause
