import { useEffect } from 'react';

const CONDITION_MAP = {
  clear:  'clear',
  cloud:  'clouds',
  rain:   'rain',
  drizzle:'rain',
  snow:   'snow',
  thunder:'storm',
  fog:    'clouds',
  mist:   'clouds',
  haze:   'clouds',
};

function conditionKey(condition = '') {
  const c = condition.toLowerCase();
  for (const [kw, key] of Object.entries(CONDITION_MAP)) {
    if (c.includes(kw)) return key;
  }
  return 'default';
}

/**
 * Applies the matching `weather-bg-*` class to `document.body`
 * and removes it on cleanup / condition change.
 */
export function useWeatherBackground(condition) {
  useEffect(() => {
    const key       = conditionKey(condition);
    const className = `weather-bg-${key}`;

    // Remove any previously applied weather class
    document.body.classList.forEach(c => {
      if (c.startsWith('weather-bg-')) document.body.classList.remove(c);
    });

    document.body.classList.add(className);

    return () => document.body.classList.remove(className);
  }, [condition]);
}

export { conditionKey };
