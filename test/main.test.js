const {JSDOM} = require('jsdom');
const {calendarUtils} = require('../calendar-utils.js');

// Set up a JSDOM environment and load main.js so the functions become available
function loadMain() {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', {url:'http://localhost'});
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.calendarUtils = calendarUtils;
  // final output element used by generateRequest
  const textarea = document.createElement('textarea');
  textarea.id = 'final-output';
  document.body.appendChild(textarea);

  return require('../main.js');
}

describe('Business day helpers', () => {
  beforeEach(() => {
    // clear cached module between tests
    jest.resetModules();
  });

  test('getSecondBusinessDay returns expected date', () => {
    const {getSecondBusinessDay} = loadMain();
    expect(getSecondBusinessDay(2025, 0)).toBe('03-01-25');
    expect(getSecondBusinessDay(2025, 3)).toBe('02-04-25');
  });

  test('getFixPpt returns expected date and validates input', () => {
    const {getFixPpt} = loadMain();
    expect(getFixPpt('02-01-25')).toBe('06-01-25');
    expect(getFixPpt('01-01-25')).toBe('03-01-25');
    expect(() => getFixPpt()).toThrow('Please provide a fixing date.');
    expect(() => getFixPpt('xx')).toThrow('Fixing date is invalid.');
  });
});

describe('generateRequest output', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  function setupInputs() {
    document.body.innerHTML = '';
    const elements = `
      <input id="qty-0" value="100" />
      <input type="radio" name="side1-0" value="buy" checked />
      <input type="radio" name="side1-0" value="sell" />
      <select id="type1-0"><option value="AVG" selected>AVG</option><option value="Fix">Fix</option></select>
      <select id="month1-0"><option>January</option></select>
      <select id="year1-0"><option>2025</option></select>
      <input type="radio" name="side2-0" value="buy" checked />
      <input type="radio" name="side2-0" value="sell" />
      <select id="type2-0"><option value="Fix">Fix</option><option value="CR2">CR2</option><option value="AVG">AVG</option></select>
      <select id="month2-0"><option>February</option></select>
      <select id="year2-0"><option>2025</option></select>
      <input type="date" id="fixDate-0" value="2025-01-02" />
      <input type="checkbox" id="samePpt-0" />
      <p id="output-0"></p>
      <textarea id="final-output"></textarea>
    `;
    document.body.insertAdjacentHTML('afterbegin', elements);
  }

  test('AVG vs AVG output', () => {
    const {generateRequest} = loadMain();
    setupInputs();
    // Set leg2 type to AVG
    document.getElementById('type2-0').value = 'AVG';
    generateRequest(0);
    const text = document.getElementById('output-0').textContent;
    expect(text).toBe('LME Request: Buy 100 mt Al AVG January 2025 Flat and Buy 100 mt Al AVG February 2025 Flat against');
  });

  test('Fix leg', () => {
    const {generateRequest} = loadMain();
    setupInputs();
    // set leg1 type to Fix
    document.getElementById('type1-0').value = 'Fix';
    generateRequest(0);
    const text = document.getElementById('output-0').textContent;
    expect(text).toBe('LME Request: Buy 100 mt Al Fix ppt 06-01-25 and Buy 100 mt Al USD ppt 06-01-25 against');
  });

  test('CR2 scenario', () => {
    const {generateRequest} = loadMain();
    setupInputs();
    // set leg2 type to CR2
    document.getElementById('type2-0').value = 'CR2';
    generateRequest(0);
    const text = document.getElementById('output-0').textContent;
    expect(text).toBe('LME Request: Buy 100 mt Al AVG January 2025 Flat and Buy 100 mt Al CR2 02-01-25 ppt 06-01-25 against');
  });
});
