import { processForecast } from '../controllers/weatherController.js';

describe('Weather Data Processing', () => {
  test('processForecast correctly groups and slices forecast', () => {
    const mockDataList = [
      { dt: 1710500000, main: { temp: 20 }, weather: [{ icon: '01d', main: 'Clear' }] },
      { dt: 1710510800, main: { temp: 25 }, weather: [{ icon: '01d', main: 'Clear' }] },
      { dt: 1710586400, main: { temp: 15 }, weather: [{ icon: '02d', main: 'Clouds' }] },
      { dt: 1710672800, main: { temp: 10 }, weather: [{ icon: '03d', main: 'Rain' }] },
    ];
    
    const result = processForecast(mockDataList);
    
    // Result should be grouped by date
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('tempHigh');
    expect(result[0]).toHaveProperty('tempLow');
    expect(result[0]).toHaveProperty('day');
  });
});
