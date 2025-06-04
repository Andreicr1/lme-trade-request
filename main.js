const lmeHolidays = {
2025: ["2025-01-01", "2025-03-18", "2025-04-21", "2025-05-05", "2025-05-26", "2025-08-25", "2025-12-25", "2025-12-26"],
2026: ["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25", "2026-08-31", "2026-12-25", "2026-12-26"]
};

function formatDateEU(date) {
const d = String(date.getDate()).padStart(2, '0');
const m = String(date.getMonth() + 1).padStart(2, '0');
const y = String(date.getFullYear()).slice(-2);
return `${d}-${m}-${y}`;
}

function getSecondBusinessDay(year, month) {
const holidays = lmeHolidays[year] || [];
let date = new Date(year, month + 1, 1);
let count = 0;
while (count < 2) {
const isoDate = date.toISOString().split('T')[0];
const day = date.getDay();
if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) count++;
if (count < 2) date.setDate(date.getDate() + 1);
}
return formatDateEU(date);
}

function getFixPpt(dateFix, year) {
const holidays = lmeHolidays[year] || [];
let date = new Date(dateFix);
let count = 0;
while (count < 2) {
date.setDate(date.getDate() + 1);
const isoDate = date.toISOString().split('T')[0];
const day = date.getDay();
if (day !== 0 && day !== 6 && !holidays.includes(isoDate)) count++;
}
return formatDateEU(date);
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function generateRequest(index) {
try {
const qtyInput = document.getElementById(`qty-${index}`);
const q = parseFloat(qtyInput.value);
const outputEl = document.getElementById(`output-${index}`);
if (!isFinite(q)) {
qtyInput.classList.add('border-red-500');
if (outputEl) outputEl.textContent = 'Please enter a valid quantity.';
qtyInput.focus();
return;
}
qtyInput.classList.remove('border-red-500');
const leg1Side = document.querySelector(`input[name='side1-${index}']:checked`).value;
const leg1Type = document.getElementById(`type1-${index}`)?.value || 'AVG';
const month = document.getElementById(`month1-${index}`).value;
const year = parseInt(document.getElementById(`year1-${index}`).value);
const leg2Side = document.querySelector(`input[name='side2-${index}']:checked`).value;
const leg2Type = document.getElementById(`type2-${index}`).value;
const dateFix = document.getElementById(`fixDate-${index}`).value;
const useSamePPT = document.getElementById(`samePpt-${index}`).checked;
const monthIndex = new Date(`${month} 1, ${year}`).getMonth();
const pptDateAVG = getSecondBusinessDay(year, monthIndex);

let leg1 = `${capitalize(leg1Side)} ${q} mt Al ${leg1Type === 'AVG' ? `AVG ${month} ${year} Flat` : `USD ppt ${pptDateAVG}`}`;
let leg2;
if (leg2Type === 'AVG') {
const month2 = document.getElementById(`month2-${index}`).value;
const year2 = parseInt(document.getElementById(`year2-${index}`).value);
leg2 = `${capitalize(leg2Side)} ${q} mt Al AVG ${month2} ${year2} Flat`;
} else {
const pptFix = useSamePPT ? pptDateAVG : getFixPpt(dateFix, year);
leg2 = `${capitalize(leg2Side)} ${q} mt Al USD ppt ${pptFix}`;
}

const result = `LME Request: ${leg1} and ${leg2} against`;
if (outputEl) outputEl.textContent = result;

const finalOutput = document.getElementById('final-output');
if (!finalOutput.value.includes(result)) finalOutput.value += result + "\n";
} catch (e) {
console.error("Error generating request:", e);
}
}

function clearTrade(index) {
const inputs = document.querySelectorAll(`#trade-${index} input, #trade-${index} select`);
inputs.forEach(input => {
if (input.type === 'radio') input.checked = input.defaultChecked;
else if (input.type === 'checkbox') input.checked = false;
else input.value = input.defaultValue;
});
document.getElementById(`output-${index}`).textContent = '';
updateFinalOutput();
syncLegSides(index);
}

function removeTrade(index) {
const trade = document.getElementById(`trade-${index}`);
if (trade) {
trade.remove();
updateFinalOutput();
}
}

function updateFinalOutput() {
const allOutputs = document.querySelectorAll("[id^='output-']");
const finalOutput = Array.from(allOutputs).map(el => el.textContent.trim()).filter(t => t).join("\n");
document.getElementById('final-output').value = finalOutput;
}

function syncLegSides(index) {
const selected = document.querySelector(`input[name='side1-${index}']:checked`);
if (!selected) return;
const leg2Options = document.querySelectorAll(`input[name='side2-${index}']`);
leg2Options.forEach(opt => {
opt.disabled = opt.value === selected.value;
});
const leg2Checked = document.querySelector(`input[name='side2-${index}']:checked`);
if (leg2Checked && leg2Checked.disabled) {
leg2Options.forEach(opt => {
if (!opt.disabled) opt.checked = true;
});
}
}

function copyAll() {
const text = document.getElementById('final-output').value;
navigator.clipboard.writeText(text).then(() => alert('Copied to clipboard'));
}

function addTrade() {
const index = document.querySelectorAll('.trade-block').length;
const template = document.getElementById('trade-template');
const clone = template.content.cloneNode(true);
clone.querySelectorAll('[id]').forEach(el => {
const baseId = el.id.replace(/-\d+$/, '');
el.id = `${baseId}-${index}`;
if (el.name) el.name = el.name.replace(/-\d+$/, `-${index}`);
});
clone.querySelectorAll('[name]:not([id])').forEach(el => {
el.name = el.name.replace(/-\d+$/, `-${index}`);
});
clone.querySelector("[id^='output-']").id = `output-${index}`;
clone.querySelector("button[name='generate']").setAttribute('onclick', `generateRequest(${index})`);
clone.querySelector("button[name='clear']").setAttribute('onclick', `clearTrade(${index})`);
clone.querySelector("button[name='remove']").setAttribute('onclick', `removeTrade(${index})`);
const div = document.createElement('div');
div.id = `trade-${index}`;
div.className = 'trade-block';
div.appendChild(clone);
document.getElementById('trades').appendChild(div);
document.querySelectorAll(`input[name='side1-${index}']`).forEach(r => {
r.addEventListener('change', () => syncLegSides(index));
});
syncLegSides(index);
}

window.onload = () => addTrade();
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register("service-worker.js")
.catch(err => console.error("Service Worker registration failed:", err));
}

