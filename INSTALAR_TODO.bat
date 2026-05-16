@echo off
echo ========================================
echo  Instalando dependencias de proyectos
echo  Elías Martínez - miRepoDemoRemoto
echo ========================================
echo.

REM Demo_Hooks
echo [1/12] Demo_Hooks...
cd /d "%~dp0Demo_Hooks\Demo_Hooks"
call npm install

REM Demo_Vue
echo [2/12] Demo_Vue...
cd /d "%~dp0Demo_Vue\demo_vue"
call npm install

REM FrontBackEnd
echo [3/12] FrontBackEnd...
cd /d "%~dp0FrontBackEnd"
call npm install

REM FrontBackEndPosgreSQL
echo [4/12] FrontBackEndPosgreSQL...
cd /d "%~dp0FrontBackEndPosgreSQL"
call npm install

REM NodeJsBackendIntro
echo [5/12] NodeJsBackendIntro...
cd /d "%~dp0NodeJsBackendIntro"
call npm install

REM ProfeList
echo [6/12] ProfeList (Electron + MySQL)...
cd /d "%~dp0ProfeList"
call npm install

REM ReactDemo/my-app
echo [7/12] ReactDemo/my-app...
cd /d "%~dp0ReactDemo\my-app"
call npm install

REM ReactDemo/DemoSesion
echo [8/12] ReactDemo/DemoSesion...
cd /d "%~dp0ReactDemo\DemoSesion"
call npm install

REM Strip_Pasarela_Demo
echo [9/12] Strip_Pasarela_Demo...
cd /d "%~dp0Strip_Pasarela_Demo"
call npm install

REM Supabase-Auth
echo [10/12] Supabase-Auth...
cd /d "%~dp0Supabase-Auth"
call npm install

REM ToDo_Nuxt
echo [11/12] ToDo_Nuxt...
cd /d "%~dp0ToDo_Nuxt"
call npm install

REM HelloWorld
echo [12/12] HelloWorld...
cd /d "%~dp0HelloWorld"
call npm install

echo.
echo ========================================
echo  ✅ Todas las dependencias instaladas
echo ========================================
pause
