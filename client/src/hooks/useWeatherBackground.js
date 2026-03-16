/**
 * Logic to map weather conditions to CSS background classes.
 */



export function conditionToClass(condition) {
  if (!condition) return 'default';
  const c = condition.toLowerCase();
  if (c.includes('clear'))                         return 'clear';
  if (c.includes('cloud'))                         return 'clouds';
  if (c.includes('rain') || c.includes('drizzle')) return 'rain';
  if (c.includes('snow'))                          return 'snow';
  if (c.includes('thunder'))                       return 'storm';
  return 'default';
}

export function useWeatherBackground(condition) {
  const key = conditionToClass(condition);
  return `weather-bg-${key}`;
}
