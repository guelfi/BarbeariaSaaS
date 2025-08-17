#!/bin/bash

# Script para iniciar apenas o Web.Admin (Blazor)

echo "🚀 Iniciando Web.Admin (Blazor) na porta 1001..."
echo ""

# Verificar se a porta está disponível
if lsof -Pi :1001 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 1001 já está em uso!"
    exit 1
fi

# Navegar para o diretório do projeto
cd src/Web.Admin

echo "🔄 Iniciando Web.Admin..."
echo "📋 Credencial de admin: guelfi@msn.com / @5ST73EA4x"
echo ""

# Iniciar o projeto
dotnet run --urls=http://localhost:1001