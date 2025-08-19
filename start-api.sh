#!/bin/bash

# Script para iniciar apenas a API (.NET Core)

echo "🚀 Iniciando Barbearia.Api na porta 4004..."
echo ""

# Verificar se a porta está disponível
if lsof -Pi :4004 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Porta 4004 já está em uso!"
    exit 1
fi

# Navegar para o diretório do projeto
cd src/Api/Presentation/Barbearia.Api

echo "🔄 Iniciando Barbearia.Api..."
echo ""

# Iniciar o projeto
dotnet run --project temp_barbearia_api.csproj --urls=http://localhost:4004