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

// Adicionando o tipo de preço 'Spot' na Leg 2
const priceTypesLeg2 = ['AVG', 'Fix', 'Spot']; // Atualize os tipos de preço disponíveis

// Função para lidar com a seleção do tipo de preço na Leg 2
function handlePriceTypeSelectionLeg2(priceType) {
    if (priceType === 'Spot') {
        disableLeg1(); // Desabilita Leg 1
    } else {
        enableLeg1(); // Habilita Leg 1
    }
}

// Função para gerar o resumo do trade
function generateTradeSummary(leg1, leg2, tradeDate) {
    let summary = `Buy ${leg1.quantity} mt ${leg1.material} ${leg1.priceType} ppt ${tradeDate}`;
    if (leg2) {
        summary += ` | Sell ${leg2.quantity} mt ${leg2.material} ${leg2.priceType} ppt ${tradeDate}`;
    }
    return summary;
}

// Funções auxiliares para habilitar/desabilitar Leg 1
function disableLeg1() {
    const leg1Container = document.getElementById('leg1-container');
    if (leg1Container) {
        leg1Container.style.display = 'none'; // Esconde Leg 1
    }
}

function enableLeg1() {
    const leg1Container = document.getElementById('leg1-container');
    if (leg1Container) {
        leg1Container.style.display = 'block'; // Mostra Leg 1
    }
}

// Vincule a função ao evento de mudança na seleção de tipo de preço da Leg 2
document.getElementById('priceTypeLeg2').addEventListener('change', function (event) {
    handlePriceTypeSelectionLeg2(event.target.value);
});

// ...existing code...
