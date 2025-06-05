// src/logic/tradeLogic.mjs

function formatAVG({ quantity, side, material, month, year }) {
  return `${capitalize(side)} ${quantity} mt ${material} AVG ${month} ${year} Flat`;
}

function formatFix({ quantity, side, material, fixDate, pptDate }) {
  return `${capitalize(side)} ${quantity} mt ${material} USD ppt ${pptDate}`;
}

function formatSpot({ quantity, side, material, tradeDate }) {
  return `${capitalize(side)} ${quantity} mt ${material} Spot ppt ${tradeDate}`;
}

function formatC2R({ quantity, side, material, contangoDate, pptDate }) {
  return `${capitalize(side)} ${quantity} mt ${material} C2R ${contangoDate} ppt ${pptDate}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export { formatAVG, formatFix, formatSpot, formatC2R };


