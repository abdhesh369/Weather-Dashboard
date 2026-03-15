import React from 'react';
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import {
  Cloud,
  CloudSun,
  CloudRain,
  Sun,
  MapPin,
  CloudSnow,
  CloudLightning,
  AlignLeft
} from 'lucide-react';

const getLucideIcon = (condition) => {
  const c = condition.toLowerCase();
  if (c.includes('clear')) return Sun;
  if (c.includes('rain') || c.includes('drizzle')) return CloudRain;
  if (c.includes('snow')) return CloudSnow;
  if (c.includes('thunder')) return CloudLightning;
  if (c.includes('cloud')) {
    if (c.includes('few') || c.includes('scattered')) return CloudSun;
    return Cloud;
  }
  return AlignLeft; // For fog/mist/haze
};

const getBackgroundUrl = (condition) => {
  const c = condition.toLowerCase();
  if (c.includes('clear')) return 'https://images.unsplash.com/photo-1601297183314-c09d33f5e0cf?q=80&w=1920&auto=format&fit=crop';
  if (c.includes('rain') || c.includes('drizzle')) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1920&auto=format&fit=crop';
  if (c.includes('snow')) return 'https://images.unsplash.com/photo-1517260739337-6799d239ce83?q=80&w=1920&auto=format&fit=crop';
  if (c.includes('thunder')) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0ce49?q=80&w=1920&auto=format&fit=crop';
  // default/clouds
  return 'https://images.unsplash.com/photo-1590867286251-8e26d9f255c0?q=80&w=1920&auto=format&fit=crop';
};

export default function PremiumDashboard({ weatherData, convertTemp, units }) {
  const { current, forecast } = weatherData;
  const { hourly, daily } = forecast;

  const bgUrl = getBackgroundUrl(current.condition);
  const now = new Date();
  const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateString = now.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric' });

  const unitLabel = units === 'metric' ? '°C' : '°F';

  return (
    <div
      className='w-full min-h-[600px] flex items-center justify-center p-4 md:p-8 rounded-2xl overflow-hidden relative'
      style={{
        background: `url("${bgUrl}") center / cover no-repeat`,
      }}
    >
      <div className='relative z-10 grid w-full max-w-xl grid-cols-2 gap-4 mx-auto'>
        
        {/* Hourly Forecast Card */}
        <LiquidGlassCard
          shadowIntensity='xs'
          borderRadius='16px'
          glowIntensity='none'
          className='col-span-2 p-6 text-white bg-black/20'
        >
          <div className='flex justify-between text-sm font-medium overflow-x-auto pb-2 scrollbar-hide gap-4'>
            {hourly?.map((hour, idx) => {
              const Icon = getLucideIcon(hour.condition);
              return (
                <div key={idx} className='flex flex-col items-center gap-2 min-w-[50px] shrink-0'>
                  <span>{hour.time}</span>
                  <Icon className='h-6 w-6 text-white/90 drop-shadow-md' />
                  <span>{convertTemp(hour.temp)}°</span>
                </div>
              );
            })}
          </div>
        </LiquidGlassCard>

        {/* Current Weather Card */}
        <LiquidGlassCard
          shadowIntensity='xs'
          borderRadius='24px'
          glowIntensity='none'
          className='p-6 text-white bg-black/20 flex flex-col items-start justify-center'
        >
          <div className='text-5xl md:text-6xl font-semibold drop-shadow-md'>
            {convertTemp(current.temperature)}{unitLabel}
          </div>
          <div className='text-lg md:text-xl font-medium mt-2 drop-shadow-md opacity-90 capitalize'>
            {current.description}
          </div>
          {daily?.[0] && (
            <div className='text-base opacity-80 mt-1 font-medium'>
              {convertTemp(daily[0].tempHigh)}° / {convertTemp(daily[0].tempLow)}°
            </div>
          )}
        </LiquidGlassCard>

        {/* Time and Location Card */}
        <LiquidGlassCard
          shadowIntensity='xs'
          borderRadius='24px'
          glowIntensity='none'
          className='p-6 text-white bg-black/20 flex flex-col items-start justify-center'
        >
          <div className='text-5xl md:text-6xl font-semibold drop-shadow-md'>{timeString}</div>
          <div className='text-sm md:text-base opacity-90 drop-shadow-md mt-2 font-medium'>{dateString}</div>
          <div className='mt-4 inline-flex items-center gap-1.5 rounded-full bg-black/30 backdrop-blur-3xl px-3 py-1.5 text-sm font-semibold border border-white/10 shadow-inner'>
            <MapPin className='h-4 w-4' />
            <span className="truncate max-w-[120px]">{current.city}</span>
          </div>
        </LiquidGlassCard>

        {/* Daily Forecast Card */}
        <LiquidGlassCard
          shadowIntensity='xs'
          borderRadius='24px'
          glowIntensity='none'
          className='col-span-2 bg-black/20 p-6 text-white flex flex-col gap-5'
        >
          {daily?.map((day, idx) => {
            const Icon = getLucideIcon(day.condition);
            return (
              <div key={idx} className='flex items-center justify-between font-medium text-lg'>
                <div className='flex items-center gap-4'>
                  <Icon className='h-[22px] w-[22px] text-white/90 drop-shadow-sm' />
                  <span>{idx === 0 ? "Today" : day.day}</span>
                </div>
                <div className="flex gap-2">
                  <span className='drop-shadow-sm'>{convertTemp(day.tempHigh)}°</span>
                  <span className='opacity-50'>/</span>
                  <span className='opacity-70 drop-shadow-sm'>{convertTemp(day.tempLow)}°</span>
                </div>
              </div>
            );
          })}
        </LiquidGlassCard>
      </div>
    </div>
  );
}
