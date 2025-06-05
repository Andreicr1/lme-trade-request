const { handlePriceTypeSelectionLeg1, generateTradeSummary } = require('../logic/tradeLogic');

describe('Trade Logic Tests', () => {
    test('Deve desabilitar Leg 2 ao selecionar Spot', () => {
        // Simula a seleção de Spot
        document.body.innerHTML = `
            <div id="leg2-container"></div>
        `;
        handlePriceTypeSelectionLeg1('Spot');
        const leg2Container = document.getElementById('leg2-container');
        expect(leg2Container.style.display).toBe('none');
    });

    test('Deve gerar resumo correto para Spot', () => {
        const leg1 = { quantity: 10, material: 'Al', priceType: 'Spot' };
        const tradeDate = '05-06-2025';
        const summary = generateTradeSummary(leg1, tradeDate);
        expect(summary).toBe('Buy 10 mt Al Spot ppt 05-06-2025');
    });
});

