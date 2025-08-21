#!/bin/bash

# Script para gerenciar todos os projetos da Barbearia SaaS

# Criar diretório de logs se não existir
mkdir -p logs

start() {
    echo "🚀 Iniciando todos os projetos da Barbearia SaaS..."
    
    # Iniciar em paralelo
    bash start-api.sh start &
    bash start-admin.sh start &
    bash start-desktop.sh start &
    bash start-mobile.sh start &
    
    wait
    echo "
🎉 Todos os projetos foram iniciados!"
    status
}

stop() {
    echo "🛑 Parando todos os projetos da Barbearia SaaS..."

    # Parar em paralelo
    bash start-api.sh stop &
    bash start-admin.sh stop &
    bash start-desktop.sh stop &
    bash start-mobile.sh stop &

    wait
    echo "
✅ Todos os projetos foram parados!"
}

status() {
    echo "
🔍 Verificando status de todos os projetos..."
    echo "--------------------------------------------------"
    bash start-api.sh status
    echo "--------------------------------------------------"
    bash start-admin.sh status
    echo "--------------------------------------------------"
    bash start-desktop.sh status
    echo "--------------------------------------------------"
    bash start-mobile.sh status
    echo "--------------------------------------------------"
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
