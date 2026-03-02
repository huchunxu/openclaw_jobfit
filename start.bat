@echo off
REM JobFit 一键启动脚本 (Windows)
REM 用法: start.bat [选项]
REM 选项:
REM   --backend only  - 仅启动后端
REM   --frontend only - 仅启动前端
REM   --install      - 安装所有依赖
REM   --stop        - 停止所有服务

setlocal enabledelayedexpansion

set "PROJECT_ROOT=%~dp0"
cd /d "%PROJECT_ROOT%"

set "BACKEND_PID="
set "FRONTEND_PID="

:parse_args
if "%~1"=="" goto main
if "%~1"=="--backend-only" goto backend_only
if "%~1"=="--frontend-only" goto frontend_only
if "%~1"=="--install" goto install
if "%~1"=="--stop" goto stop
if "%~1"=="--help" goto help
echo Unknown option: %~1
goto help

:help
echo JobFit 一键启动脚本
echo.
echo 用法: start.bat [选项]
echo.
echo 选项:
echo   --backend only    仅启动后端服务
echo   --frontend only   仅启动前端服务
echo   --install         安装所有依赖
echo   --stop           停止所有服务
echo   --help           显示此帮助
echo.
echo 示例:
echo   start.bat              启动前后端服务
echo   start.bat --install   安装依赖并启动
goto :eof

:install
echo [JobFit] 安装依赖...
echo.
echo [JobFit] 安装后端依赖...
cd /d "%PROJECT_ROOT%backend"
pip install -r requirements.txt
if errorlevel 1 (
    echo [Error] 后端依赖安装失败
    goto :eof
)
echo.
echo [JobFit] 安装前端依赖...
cd /d "%PROJECT_ROOT%frontend"
call npm install
if errorlevel 1 (
    echo [Error] 前端依赖安装失败
    goto :eof
)
echo.
echo [JobFit] 依赖安装完成！
goto :eof

:backend_only
echo [JobFit] 启动后端服务...
cd /d "%PROJECT_ROOT%backend"
start "JobFit Backend" cmd /k "python -m uvicorn api.main:app --reload --port 8000"
echo [JobFit] 后端已启动，访问 http://localhost:8000/docs 查看API文档
goto :eof

:frontend_only
echo [JobFit] 启动前端服务...
cd /d "%PROJECT_ROOT%frontend"
start "JobFit Frontend" cmd /k "npm run dev"
echo [JobFit] 前端已启动，访问 http://localhost:3000
goto :eof

:stop
echo [JobFit] 停止服务...
taskkill /F /FI "WINDOWTITLE eq JobFit Backend*" 2>nul
taskkill /F /FI "WINDOWTITLE eq JobFit Frontend*" 2>nul
taskkill /F /IM python.exe /FI "WINDOWTITLE eq JobFit*" 2>nul
taskkill /F /IM node.exe /FI "WINDOWTITLE eq JobFit*" 2>nul
echo [JobFit] 服务已停止
goto :eof

:main
echo [JobFit] ========================================
echo [JobFit]   JobFit 启动中...
echo [JobFit] ========================================
echo.

call :install
echo.

echo [JobFit] 启动后端服务...
cd /d "%PROJECT_ROOT%backend"
start "JobFit Backend" cmd /k "python -m uvicorn api.main:app --reload --port 8000"
timeout /t 2 /nobreak >nul

echo [JobFit] 启动前端服务...
cd /d "%PROJECT_ROOT%frontend"
start "JobFit Frontend" cmd /k "npm run dev"

echo.
echo [JobFit] ========================================
echo [JobFit]   启动完成！
echo [JobFit] ========================================
echo 前端: http://localhost:3000
echo 后端: http://localhost:8000
echo API文档: http://localhost:8000/docs
echo.
echo 按任意键退出（服务继续运行）...
pause >nul