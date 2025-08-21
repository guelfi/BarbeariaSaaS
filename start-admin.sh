#!/bin/bash

# Script para gerenciar o Web.Admin (Blazor)

PORT=4001
PROJECT_NAME="Web.Admin"
PROJECT_PATH="src/Web.Admin"
PID_FILE="logs/admin.pid"

# Criar diretório de logs se não existir
mkdir -p logs

start() {
    echo "🚀 Iniciando $PROJECT_NAME na porta $PORT..."
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "⚠️  $PROJECT_NAME já está em execução (PID: $pid)."
            exit 1
        fi
    fi

    if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $PORT já está em uso!"
        exit 1
    fi

    cd "$PROJECT_PATH"
    
    echo "🔄 Iniciando $PROJECT_NAME..."
    echo "📋 Credencial de admin: guelfi@msn.com / @5ST73EA4x"
    dotnet run --urls=http://localhost:$PORT > "../logs/admin-stdout.log" 2> "../logs/admin-stderr.log" &
    pid=$!
    
    echo $pid > "../$PID_FILE"
    
    echo "⏳ Aguardando o Admin inicializar..."
    sleep 5

    if kill -0 "$pid" 2>/dev/null; then
        echo "✅ $PROJECT_NAME iniciado com sucesso (PID: $pid)."
        echo "📝 Logs disponíveis em: logs/admin-stdout.log e logs/admin-stderr.log"
    else
        echo "❌ Falha ao iniciar o $PROJECT_NAME."
        rm "../$PID_FILE"
        exit 1
    fi
}

stop() {
    echo "🛑 Parando $PROJECT_NAME..."
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            kill "$pid"
            rm "$PID_FILE"
            echo "✅ $PROJECT_NAME (PID: $pid) parado."
        else
            echo "⚠️  $PROJECT_NAME não estava em execução."
            rm "$PID_FILE"
        fi
    else
        echo "⚠️  Arquivo PID não encontrado. Tentando parar pela porta..."
        pid=$(lsof -ti:$PORT)
        if [ ! -z "$pid" ]; then
            kill -9 $pid
            echo "✅ Processo na porta $PORT (PID: $pid) terminado."
        else
            echo "⚠️  Nenhum processo encontrado na porta $PORT."
        fi
    fi
}

status() {
    echo "🔍 Verificando status de $PROJECT_NAME..."
    if [ -f "$PID_FILE" ]; then
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "✅ $PROJECT_NAME está em execução (PID: $pid)."
            echo "   Ouvindo na porta $PORT."
        else
            echo "❌ $PROJECT_NAME não está em execução, mas o arquivo PID existe."
            rm "$PID_FILE"
        fi
    else
        pid=$(lsof -ti:$PORT)
        if [ ! -z "$pid" ]; then
            echo "✅ Um processo está em execução na porta $PORT (PID: $pid), mas não foi iniciado por este script."
        else
            echo "❌ $PROJECT_NAME não está em execução."
        fi
    fi
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    status)
        status
        ;;
    *)
        echo "Uso: $0 {start|stop|status}"
        exit 1
esac
