#!/bin/bash

# JobFit 一键启动脚本
# 用法: ./start.sh [选项]
# 选项: 
#   --backend only  - 仅启动后端
#   --frontend only - 仅启动前端  
#   --install      - 安装所有依赖
#   --help         - 显示帮助

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$PROJECT_ROOT"

# 打印带颜色的消息
print_msg() {
    echo -e "${GREEN}[JobFit]${NC} $1"
}

print_warn() {
    echo -e "${YELLOW}[Warning]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

# 检查命令是否存在
check_command() {
    if ! command -v $1 &> /dev/null; then
        print_error "$1 未安装，请先安装"
        exit 1
    fi
}

# 显示帮助
show_help() {
    echo "JobFit 一键启动脚本"
    echo ""
    echo "用法: $0 [选项]"
    echo ""
    echo "选项:"
    echo "  --backend only    仅启动后端服务"
    echo "  --frontend only   仅启动前端服务"
    echo "  --install         安装所有依赖（首次运行）"
    echo "  --help           显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0                启动前后端服务"
    echo "  $0 --install      安装依赖并启动"
    echo "  $0 --backend only 仅启动后端"
}

# 安装依赖
install_deps() {
    print_msg "开始安装依赖..."
    
    # 检查 Python
    if command -v python3 &> /dev/null; then
        print_msg "安装后端依赖..."
        cd "$PROJECT_ROOT/backend"
        pip3 install -r requirements.txt
    else
        print_warn "Python 未安装，跳过后端依赖"
    fi
    
    # 检查 Node.js
    if command -v npm &> /dev/null; then
        print_msg "安装前端依赖..."
        cd "$PROJECT_ROOT/frontend"
        npm install
    else
        print_warn "Node.js 未安装，跳过前端依赖"
    fi
    
    print_msg "依赖安装完成！"
}

# 启动后端
start_backend() {
    print_msg "启动后端服务..."
    cd "$PROJECT_ROOT/backend"
    
    # 检查依赖
    if [ ! -d "venv" ] && [ -f "requirements.txt" ]; then
        print_warn "建议创建虚拟环境: python3 -m venv venv"
    fi
    
    # 启动后端
    python3 -m uvicorn api.main:app --reload --port 8000 &
    BACKEND_PID=$!
    
    print_msg "后端服务已启动 (PID: $BACKEND_PID)"
    print_msg "API文档: http://localhost:8000/docs"
    print_msg "健康检查: http://localhost:8000/health"
    
    echo $BACKEND_PID > /tmp/jobfit_backend.pid
}

# 启动前端
start_frontend() {
    print_msg "启动前端服务..."
    cd "$PROJECT_ROOT/frontend"
    
    # 启动前端
    npm run dev &
    FRONTEND_PID=$!
    
    print_msg "前端服务已启动 (PID: $FRONTEND_PID)"
    print_msg "访问地址: http://localhost:3000"
    
    echo $FRONTEND_PID > /tmp/jobfit_frontend.pid
}

# 停止服务
stop_services() {
    print_msg "停止服务..."
    
    if [ -f /tmp/jobfit_backend.pid ]; then
        kill $(cat /tmp/jobfit_backend.pid) 2>/dev/null || true
        rm /tmp/jobfit_backend.pid
    fi
    
    if [ -f /tmp/jobfit_frontend.pid ]; then
        kill $(cat /tmp/jobfit_frontend.pid) 2>/dev/null || true
        rm /tmp/jobfit_frontend.pid
    fi
    
    # 也尝试杀进程
    pkill -f "uvicorn api.main:app" 2>/dev/null || true
    pkill -f "next dev" 2>/dev/null || true
    
    print_msg "服务已停止"
}

# 主逻辑
case "${1:-}" in
    --backend-only|--backend\ only)
        start_backend
        ;;
    --frontend-only|--frontend\ only)
        start_frontend
        ;;
    --install)
        install_deps
        ;;
    --stop)
        stop_services
        ;;
    --help|-h)
        show_help
        ;;
    "")
        print_msg "启动 JobFit 前后端服务..."
        
        # 安装依赖
        install_deps
        
        # 启动后端
        start_backend
        
        # 等待后端启动
        sleep 2
        
        # 启动前端
        start_frontend
        
        echo ""
        print_msg "========================================"
        print_msg "  JobFit 启动完成！"
        print_msg "========================================"
        print_msg "前端: http://localhost:3000"
        print_msg "后端: http://localhost:8000"
        print_msg "API文档: http://localhost:8000/docs"
        echo ""
        print_msg "按 Ctrl+C 停止服务"
        
        # 等待
        trap "stop_services; exit 0" SIGINT SIGTERM
        
        wait
        ;;
    *)
        print_error "未知选项: $1"
        show_help
        exit 1
        ;;
esac