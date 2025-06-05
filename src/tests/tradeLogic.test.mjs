// src/tests/tradeLogic.test.js
import { generateRequest } from '../../main.mjs';

beforeEach(() => {
  document.body.innerHTML = `
    <input id="qty-0" value="10" />
    <input type="radio" name="side1-0" value="buy" checked />
    <select id="type1-0"><option value="AVG" selected>AVG</option></select>
    <select id="month1-0"><option>January</option></select>
    <select id="year1-0"><option>2025</option></select>

    <input type="radio" name="side2-0" value="sell" checked />
    <select id="type2-0"><option value="AVG" selected>AVG</option></select>
    <select id="month2-0"><option>February</option></select>
    <select id="year2-0"><option>2025</option></select>

    <p id="output-0"></p>
    <textarea id="final-output"></textarea>
  `;
});

test('generateRequest deve montar string AVG corretamente', () => {
  generateRequest(0);
  const result = document.getElementById('output-0').textContent;
  expect(result).toContain('Buy 10 mt Al AVG January 2025');
  expect(result).toContain('Sell 10 mt Al AVG February 2025');
});

test('deve exibir erro com fixing vazio', () => {
  document.body.innerHTML = `
    <input id="qty-0" value="10" />
    <input type="radio" name="side1-0" value="buy" checked />
    <select id="type1-0"><option value="Fix" selected>Fix</option></select>
    <input id="fixDate-0" value="" />
    <p id="output-0"></p>
    <textarea id="final-output"></textarea>
  `;

  generateRequest(0);
  const result = document.getElementById('output-0').textContent;
  expect(result).toBe('Please provide a fixing date.');
});




