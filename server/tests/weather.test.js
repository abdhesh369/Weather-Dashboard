import { describe, test, expect } from '@jest/globals';
import { processForecast } from '../controllers/weatherController.js';

describe('Weather Data Processing', () => {
  test('processForecast correctly groups and slices forecast', () => {
    const mockDataList = [
      { dt: 1710500000, main: { temp: 20, humidity: 60, feels_like: 19 }, wind: { speed: 3.5, deg: 180 }, weather: [{ icon: '01d', main: 'Clear', description: 'clear sky' }], clouds: { all: 5 }, pop: 0 },
      { dt: 1710510800, main: { temp: 25, humidity: 55, feels_like: 24 }, wind: { speed: 4.0, deg: 200 }, weather: [{ icon: '01d', main: 'Clear', description: 'clear sky' }], clouds: { all: 10 }, pop: 0 },
      { dt: 1710586400, main: { temp: 15, humidity: 70, feels_like: 14 }, wind: { speed: 5.2, deg: 90 },  weather: [{ icon: '02d', main: 'Clouds', description: 'few clouds' }], clouds: { all: 40 }, pop: 0.2 },
      { dt: 1710672800, main: { temp: 10, humidity: 80, feels_like: 8 },  wind: { speed: 6.1, deg: 270 }, weather: [{ icon: '03d', main: 'Rain', description: 'light rain' }], clouds: { all: 75 }, pop: 0.8 },
    ];
    
    const result = processForecast(mockDataList);
    
    // Result should be grouped by date in the daily property
    expect(result.daily.length).toBeGreaterThan(0);
    expect(result.daily[0]).toHaveProperty('tempHigh');
    expect(result.daily[0]).toHaveProperty('tempLow');
    expect(result.daily[0]).toHaveProperty('day');
    
    // Result should also have hourly data
    expect(result.hourly.length).toBeGreaterThan(0);
  });
});
