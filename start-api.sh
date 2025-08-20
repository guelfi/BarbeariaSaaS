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

# Iniciar o projeto em segundo plano
dotnet run --project Barbearia.Api.csproj --urls=http://0.0.0.0:4004 &

# Aguardar 1 minuto para a API inicializar completamente
echo "Aguardando 1 minuto para a API inicializar..."
sleep 60

echo "API iniciada. Você pode executar os testes agora."
