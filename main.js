// Holiday and calendar setup
const lmeHolidays = {
  2025: ["2025-01-01", "2025-03-18", "2025-04-21", "2025-05-05", "2025-05-26", "2025-08-25", "2025-12-25", "2025-12-26"],
  2026: ["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25", "2026-08-31", "2026-12-25", "2026-12-26"]
};

async function loadHolidayData() {
  try {
    const res = await fetch('https://www.gov.uk/bank-holidays.json');
    const data = await res.json();
    const events = data['england-and-wales'].events;
    events.forEach(({ date }) => {
      const year = date.slice(0, 4);
      if (!lmeHolidays[year]) lmeHolidays[year] = [];
      if (!lmeHolidays[year].includes(date)) lmeHolidays[year].push(date);
    });
  } catch (err) {
    console.error('Failed to load holiday data:', err);
  }
}

let nextIndex = 0;

function getCalendarType() {
  const sel = document.getElementById('calendarType');
  return sel ? sel.value : 'gregorian';
}

function formatDate(date) {
  return calendarUtils.formatDate(date, getCalendarType());
}

function parseDate(str) {
  return calendarUtils.parseDate(str, getCalendarType());
}

function getSecondBusinessDay(year, month) {
  const holidays = lmeHolidays[year] || [];
  let date = new Date(year, month, 1);
  let count = 0;
  while (count < 2) {
    const isoDate = date.toISOString().split('T')[0];
    const day = date.getDay();
    if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) count++;
    if (count < 2) date.setDate(date.getDate() + 1);
  }
  return formatDate(date);
}

function getFixPpt(dateFix) {
  if (!dateFix) throw new Error('Please provide a fixing date.');
  const date = parseDate(dateFix);
  if (!date) throw new Error('Fixing date is invalid.');
  const holidays = lmeHolidays[date.getFullYear()] || [];
  let count = 0;
  while (count < 2) {
    date.setDate(date.getDate() + 1);
    const isoDate = date.toISOString().split('T')[0];
    const day = date.getDay();
    if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) count++;
  }
  return formatDate(date);
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function populateYearOptions(selectId, start, count) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const year = start + i;
    const opt = document.createElement('option');
    opt.value = year;
    opt.textContent = year;
    select.appendChild(opt);
  }
}

function parseInputDate(value) {
  if (!value) return null;
  const parts = value.split('-').map(Number);
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d);
}

function generateRequest(index) {
  const outputEl = document.getElementById(`output-${index}`);
  try {
    const qtyInput = document.getElementById(`qty-${index}`);
    const q = parseFloat(qtyInput.value);
    if (!isFinite(q) || q <= 0) {
      qtyInput.classList.add('border-red-500');
      outputEl.textContent = 'Please enter a valid quantity.';
      qtyInput.focus();
      return;
    }
    qtyInput.classList.remove('border-red-500');

    const leg1Side = document.querySelector(`input[name='side1-${index}']:checked`).value;
    const leg1Type = document.getElementById(`type1-${index}`).value;
    const leg2Side = document.querySelector(`input[name='side2-${index}']:checked`).value;
    const leg2Type = document.getElementById(`type2-${index}`).value;
    const useSamePPT = document.getElementById(`samePpt-${index}`)?.checked;

    let leg1 = '', leg2 = '';

    if (leg1Type === 'AVG') {
      const startDate = document.getElementById(`startDate1-${index}`)?.value;
      const endDate = document.getElementById(`endDate1-${index}`)?.value;
      if (startDate && endDate) {
        leg1 = `${capitalize(leg1Side)} ${q} mt Al AVG ${formatDate(parseDate(startDate))} – ${formatDate(parseDate(endDate))}`;
      } else {
        const month = document.getElementById(`month1-${index}`)?.value;
        const year = parseInt(document.getElementById(`year1-${index}`)?.value);
        const pptDateAVG = getSecondBusinessDay(year, new Date(`${month} 1, ${year}`).getMonth());
        leg1 = `${capitalize(leg1Side)} ${q} mt Al AVG ${month} ${year} Flat ppt ${pptDateAVG}`;
      }
    } else if (leg1Type === 'Fix') {
      const fixDate = document.getElementById(`fixDate-${index}`)?.value;
      const pptFix = getFixPpt(fixDate);
      leg1 = `${capitalize(leg1Side)} ${q} mt Al Fix ppt ${pptFix}`;
    } else if (leg1Type === 'Spot') {
      const fixDate = document.getElementById(`fixDate-${index}`)?.value;
      leg1 = `${capitalize(leg1Side)} ${q} mt Al SPOT ${formatDate(parseDate(fixDate))}`;
    }

    if (leg2Type === 'AVG') {
      const startDate = document.getElementById(`startDate2-${index}`)?.value;
      const endDate = document.getElementById(`endDate2-${index}`)?.value;
      if (startDate && endDate) {
        leg2 = `${capitalize(leg2Side)} ${q} mt Al AVG ${formatDate(parseDate(startDate))} – ${formatDate(parseDate(endDate))}`;
      } else {
        const month2 = document.getElementById(`month2-${index}`)?.value;
        const year2 = parseInt(document.getElementById(`year2-${index}`)?.value);
        const pptDate = getSecondBusinessDay(year2, new Date(`${month2} 1, ${year2}`).getMonth());
        leg2 = `${capitalize(leg2Side)} ${q} mt Al AVG ${month2} ${year2} Flat ppt ${pptDate}`;
      }
    } else if (leg2Type === 'Fix') {
      const fixDate2 = document.getElementById(`fixDate2-${index}`)?.value;
      const month2 = document.getElementById(`month2-${index}`)?.value;
      const year2 = parseInt(document.getElementById(`year2-${index}`)?.value);
      const pptFix = useSamePPT ? getSecondBusinessDay(year2, new Date(`${month2} 1, ${year2}`).getMonth()) : getFixPpt(fixDate2);
      leg2 = `${capitalize(leg2Side)} ${q} mt Al Fix ppt ${pptFix}`;
    } else if (leg2Type === 'C2R') {
      const fixDate2 = document.getElementById(`fixDate2-${index}`)?.value;
      const pptFix = getFixPpt(fixDate2);
      leg2 = `${capitalize(leg2Side)} ${q} mt Al C2R ${formatDate(parseDate(fixDate2))} ppt ${pptFix}`;
    }

    const result = `LME Request: ${leg1} and ${leg2} against`;
    if (outputEl) outputEl.textContent = result;
    updateFinalOutput();
  } catch (e) {
    console.error("Error generating request:", e);
    if (/Fixing date/.test(e.message)) {
      const fixInput = document.getElementById(`fixDate-${index}`);
      if (fixInput) {
        fixInput.classList.add('border-red-500');
        fixInput.focus();
      }
    }
    if (outputEl) outputEl.textContent = e.message;
  }
}

function togglePriceTypeFields(index) {
  const type1 = document.getElementById(`type1-${index}`)?.value;
  const type2 = document.getElementById(`type2-${index}`)?.value;

  const startDate1 = document.getElementById(`startDate1-${index}`);
  const endDate1 = document.getElementById(`endDate1-${index}`);
  const month1 = document.getElementById(`month1-${index}`);
  const year1 = document.getElementById(`year1-${index}`);
  const fixDate = document.getElementById(`fixDate-${index}`);

  const startDate2 = document.getElementById(`startDate2-${index}`);
  const endDate2 = document.getElementById(`endDate2-${index}`);
  const month2 = document.getElementById(`month2-${index}`);
  const year2 = document.getElementById(`year2-${index}`);
  const fixDate2 = document.getElementById(`fixDate2-${index}`);

  if (type1 === 'AVG') {
    startDate1?.classList.remove('hidden');
    endDate1?.classList.remove('hidden');
    month1?.classList.remove('hidden');
    year1?.classList.remove('hidden');
    fixDate?.classList.add('hidden');
  } else {
    fixDate?.classList.remove('hidden');
    startDate1?.classList.add('hidden');
    endDate1?.classList.add('hidden');
    month1?.classList.add('hidden');
    year1?.classList.add('hidden');
  }

  if (type2 === 'AVG') {
    startDate2?.classList.remove('hidden');
    endDate2?.classList.remove('hidden');
    month2?.classList.remove('hidden');
    year2?.classList.remove('hidden');
    fixDate2?.classList.add('hidden');
  } else {
    fixDate2?.classList.remove('hidden');
    startDate2?.classList.add('hidden');
    endDate2?.classList.add('hidden');
    month2?.classList.add('hidden');
    year2?.classList.add('hidden');
  }
}

// Add other required functions like addTrade, clearTrade, removeTrade, etc.
// already present no need to duplicate here.

window.onload = () => {
  loadHolidayData().finally(() => addTrade());
};

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register("service-worker.js").catch(err => console.error("Service Worker registration failed:", err));
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    parseInputDate,
    getSecondBusinessDay,
    getFixPpt,
    generateRequest
  };
}

