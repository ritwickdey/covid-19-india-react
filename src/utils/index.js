export function calculateActiveCase(stat) {
  return stat.confirmed - stat.recovered - stat.death;
}

export function calculateMortalityRate(stat) {
  return (stat.death / stat.confirmed) * 100;
}

export function formatNumber(num, toFixed = 0) {
  return Number(num).toLocaleString('en', {
    minimumFractionDigits: toFixed,
    maximumFractionDigits: toFixed,
  });
}

export function formatDateInAPIStd(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}
