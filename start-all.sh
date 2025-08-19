#!/bin/bash

# Script para iniciar todos os projetos da Barbearia SaaS
# Portas configuradas:
# - Web.Admin (Blazor): http://localhost:4001
# - Web.Desktop (Angular): http://localhost:4002  
# - Web.Mobile (Angular PWA): http://localhost:4003

echo "🚀 Iniciando todos os projetos da Barbearia SaaS..."
echo ""

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $1 já está em uso!"
        return 1
    else
        return 0
    fi
}

# Verificar se as portas estão disponíveis
echo "🔍 Verificando disponibilidade das portas..."
check_port 4001 || exit 1
check_port 4002 || exit 1
check_port 4003 || exit 1
echo "✅ Todas as portas estão disponíveis!"
echo ""

# Função para iniciar um projeto em background
start_project() {
    local name=$1
    local path=$2
    local command=$3
    local port=$4
    
    echo "🔄 Iniciando $name na porta $port..."
    cd "$path"
    
    # Instalar dependências se necessário
    if [[ "$command" == *"npm"* ]] && [ ! -d "node_modules" ]; then
        echo "📦 Instalando dependências do $name..."
        npm install
    fi
    
    # Iniciar o projeto
    $command > "../logs/$name.log" 2>&1 &
    local pid=$!
    echo "$pid" > "../logs/$name.pid"
    echo "✅ $name iniciado (PID: $pid)"
    cd - > /dev/null
}

# Criar diretório de logs
mkdir -p logs

# Iniciar Web.Admin (Blazor)
start_project "Web.Admin" "src/Web.Admin" "dotnet run --urls=http://localhost:4001" "4001"

# Aguardar um pouco antes de iniciar os próximos
sleep 2

# Iniciar Web.Desktop (Angular)
start_project "Web.Desktop" "src/Web.Desktop" "npm start" "4002"

# Aguardar um pouco antes de iniciar o último
sleep 2

# Iniciar Web.Mobile (Angular PWA)
start_project "Web.Mobile" "src/Web.Mobile" "npm start" "4003"

echo ""
echo "🎉 Todos os projetos foram iniciados!"
echo ""
echo "📱 URLs dos projetos:"
echo "   🔧 Web.Admin:   http://localhost:4001"
echo "   💻 Web.Desktop: http://localhost:4002"
echo "   📱 Web.Mobile:  http://localhost:4003"
echo ""
echo "📋 Credenciais de teste:"
echo "   👨‍💼 Admin:    guelfi@msn.com / @5ST73EA4x"
echo "   ✂️  Barbeiro:  barbeiro@barbearia.com / Barbeiro123!"
echo "   👤 Cliente:   cliente@email.com / Cliente123!"
echo ""
echo "📝 Logs salvos em: ./logs/"
echo "🛑 Para parar todos os projetos, execute: ./stop-all.sh"
echo ""
echo "⏳ Aguardando os projetos iniciarem completamente..."
echo "   (Isso pode levar alguns minutos na primeira execução)"

# Aguardar os projetos iniciarem
sleep 10

# Verificar se os projetos estão rodando
echo ""
echo "🔍 Verificando status dos projetos..."

check_running() {
    local name=$1
    local port=$2
    
    if curl -s "http://localhost:$port" > /dev/null 2>&1; then
        echo "✅ $name está rodando em http://localhost:$port"
    else
        echo "⏳ $name ainda está iniciando... (porta $port)"
    fi
}

check_running "Web.Admin" "4001"
check_running "Web.Desktop" "4002"
check_running "Web.Mobile" "4003"

echo ""
echo "🌐 Abra os URLs acima no seu navegador para testar os projetos!"