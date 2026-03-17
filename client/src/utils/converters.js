// ── Temperature ──────────────────────────────────────────
export const convertTemp = (tempC, units) => {
  if (units === 'imperial') return Math.round((tempC * 9 / 5) + 32);
  return Math.round(tempC);
};

// ── Wind speed ────────────────────────────────────────────
export const convertWind = (speedMs, units) => {
  if (units === 'imperial') return `${Math.round(speedMs * 2.237)} mph`;
  return `${Math.round(speedMs * 10) / 10} m/s`;
};

export const windLabel = (speedMs) => {
  if (speedMs < 0.5)  return 'Calm';
  if (speedMs < 1.5)  return 'Light air';
  if (speedMs < 3.3)  return 'Light breeze';
  if (speedMs < 5.5)  return 'Gentle breeze';
  if (speedMs < 7.9)  return 'Moderate breeze';
  if (speedMs < 10.7) return 'Fresh breeze';
  if (speedMs < 13.8) return 'Strong breeze';
  if (speedMs < 17.1) return 'Near gale';
  if (speedMs < 20.7) return 'Gale';
  if (speedMs < 24.4) return 'Strong gale';
  if (speedMs < 28.4) return 'Storm';
  if (speedMs < 32.6) return 'Violent storm';
  return 'Hurricane';
};

export const degreesToCompass = (deg) => {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16];
};

// ── Pressure ──────────────────────────────────────────────
export const convertPressure = (hPa, units) => {
  if (units === 'imperial') return `${(hPa * 0.02953).toFixed(2)} inHg`;
  return `${hPa} hPa`;
};

export const pressureLabel = (hPa) => {
  if (hPa > 1022) return 'High pressure — clear skies likely';
  if (hPa < 1000) return 'Low pressure — unsettled weather';
  return 'Normal range';
};

// ── Visibility ───────────────────────────────────────────
export const convertVisibility = (km, units) => {
  if (units === 'imperial') return `${Math.round(km * 0.6214)} mi`;
  return `${km} km`;
};

// ── Dew point (Magnus formula) ───────────────────────────
export const dewPoint = (tempC, humidity) => {
  const a = 17.27, b = 237.7;
  const alpha = ((a * tempC) / (b + tempC)) + Math.log(humidity / 100);
  return Math.round((b * alpha) / (a - alpha));
};

// ── Heat index (Steadman) – valid when temp ≥ 27°C and RH ≥ 40% ──
export const heatIndex = (tempC, rh) => {
  if (tempC < 27 || rh < 40) return null;
  const T = tempC, R = rh;
  const hi =
    -8.78469475556 +
    1.61139411 * T +
    2.33854883889 * R -
    0.14611605 * T * R -
    0.012308094 * T * T -
    0.0164248277778 * R * R +
    0.002211732 * T * T * R +
    0.00072546 * T * R * R -
    0.000003582 * T * T * R * R;
  return Math.round(hi);
};

// ── Wind chill (NOAA formula) – valid when temp ≤ 10°C and wind > 4.8 km/h ──
export const windChill = (tempC, windKmh) => {
  if (tempC > 10 || windKmh < 4.8) return null;
  const V = Math.pow(windKmh, 0.16);
  return Math.round(13.12 + 0.6215 * tempC - 11.37 * V + 0.3965 * tempC * V);
};
