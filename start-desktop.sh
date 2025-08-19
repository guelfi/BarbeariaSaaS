#!/bin/bash

# Script para iniciar apenas o Web.Desktop (React + Vite)

echo "🚀 Iniciando Web.Desktop (React + Vite) na porta 4002..."
echo ""

# Verificar se a porta está disponível
if lsof -Pi :4002 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 4002 já está em uso!"
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
npm run dev