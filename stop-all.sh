#!/bin/bash

# Script para parar todos os projetos da Barbearia SaaS

echo "🛑 Parando todos os projetos da Barbearia SaaS..."
echo ""

# Função para parar um projeto
stop_project() {
    local name=$1
    local pid_file="logs/$name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            echo "🔄 Parando $name (PID: $pid)..."
            kill "$pid"
            rm "$pid_file"
            echo "✅ $name parado"
        else
            echo "⚠️  $name já estava parado"
            rm "$pid_file"
        fi
    else
        echo "⚠️  Arquivo PID do $name não encontrado"
    fi
}

# Parar todos os projetos
stop_project "Web.Admin"
stop_project "Web.Desktop"
stop_project "Web.Mobile"

# Matar qualquer processo restante nas portas específicas
echo ""
echo "🔍 Verificando processos restantes nas portas..."

kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔄 Matando processo na porta $port (PID: $pid)..."
        kill -9 $pid
        echo "✅ Processo na porta $port terminado"
    fi
}

kill_port 1001
kill_port 1002
kill_port 1003

echo ""
echo "✅ Todos os projetos foram parados!"
echo "📝 Logs mantidos em: ./logs/"