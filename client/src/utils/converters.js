export const convertTemp = (tempInCelsius, units) => {
  if (units === 'metric') return Math.round(tempInCelsius);
  return Math.round((tempInCelsius * 9 / 5) + 32);
};

export const convertWind = (speedMs, units) => {
  if (units === 'metric') return `${speedMs} m/s`;
  return `${Math.round(speedMs * 2.237)} mph`;
};
