#!/bin/bash

# Script para iniciar apenas o Web.Desktop (Angular)

echo "🚀 Iniciando Web.Desktop (Angular) na porta 1002..."
echo ""

# Verificar se a porta está disponível
if lsof -Pi :1002 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 1002 já está em uso!"
    exit 1
fi

# Navegar para o diretório do projeto
cd src/Web.Desktop

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo "🔄 Iniciando Web.Desktop..."
echo "📋 Credencial de barbeiro: barbeiro@barbearia.com / Barbeiro123!"
echo ""

# Iniciar o projeto
npm start