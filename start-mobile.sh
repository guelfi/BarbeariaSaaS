#!/bin/bash

# Script para iniciar apenas o Web.Mobile (Angular PWA)

echo "🚀 Iniciando Web.Mobile (Angular PWA) na porta 4003..."
echo ""

# Verificar se a porta está disponível
if lsof -Pi :4003 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 4003 já está em uso!"
    exit 1
fi

# Navegar para o diretório do projeto
cd src/Web.Mobile

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🔄 Iniciando Web.Mobile..."
echo "📋 Credencial de cliente: cliente@email.com / Cliente123!"
echo ""

# Iniciar o projeto
npm start