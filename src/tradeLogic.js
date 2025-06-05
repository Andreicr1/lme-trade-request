// Adicionando o tipo de preço 'Spot' na Leg 1
const priceTypesLeg1 = ['AVG', 'Fix', 'Spot']; // Atualize os tipos de preço disponíveis

// Função para lidar com a seleção do tipo de preço na Leg 1
function handlePriceTypeSelectionLeg1(priceType) {
    if (priceType === 'Spot') {
        disableLeg2(); // Desabilita Leg 2
    } else {
        enableLeg2(); // Habilita Leg 2
    }
}

// Função para gerar o resumo do trade
function generateTradeSummary(leg1, tradeDate) {
    if (leg1.priceType === 'Spot') {
        return `Buy ${leg1.quantity} mt ${leg1.material} Spot ppt ${tradeDate}`;
    }
    // Lógica existente para outros tipos de preço
    return `Buy ${leg1.quantity} mt ${leg1.material} ${leg1.priceType} ppt ${tradeDate}`;
}

// Funções auxiliares para habilitar/desabilitar Leg 2
function disableLeg2() {
    const leg2Container = document.getElementById('leg2-container');
    if (leg2Container) {
        leg2Container.style.display = 'none'; // Esconde Leg 2
    }
}

function enableLeg2() {
    const leg2Container = document.getElementById('leg2-container');
    if (leg2Container) {
        leg2Container.style.display = 'block'; // Mostra Leg 2
    }
}

// Vincule a função ao evento de mudança na seleção de tipo de preço da Leg 1
document.getElementById('priceTypeLeg1').addEventListener('change', function (event) {
    handlePriceTypeSelectionLeg1(event.target.value);
});

// ...existing code...