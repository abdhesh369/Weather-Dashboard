import { useMemo, useEffect, useRef } from 'react';

function rainParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    height:   20 + Math.random() * 18,
    delay:    -(Math.random() * 4),
    duration: 0.6 + Math.random() * 0.5,
    opacity:  0.15 + Math.random() * 0.25,
  }));
}

function snowParticles(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left:     Math.random() * 100,
    size:     1.5 + Math.random() * 2.5,
    delay:    -(Math.random() * 10),
    duration: 6  + Math.random() * 8,
    opacity:  0.3 + Math.random() * 0.4,
    drift:    -10 + Math.random() * 20,
  }));
}

// ── Rain ─────────────────────────────────────────────────
function RainLayer({ intensity = 24 }) {
  const particles = useMemo(() => rainParticles(intensity), [intensity]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-blue-200/40 weather-rain"
          style={{
            left:              `${p.left}%`,
            width:             '1px',
            height:            `${p.height}px`,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity:           p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Snow ─────────────────────────────────────────────────
function SnowLayer({ intensity = 30 }) {
  const particles = useMemo(() => snowParticles(intensity), [intensity]);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute bg-white/70 rounded-full blur-[0.5px] weather-snow"
          style={{
            left:              `${p.left}%`,
            width:             `${p.size}px`,
            height:            `${p.size}px`,
            animationDelay:    `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            opacity:           p.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ── Thunderstorm: rain + lightning flashes ────────────────
function LightningCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let raf;
    let nextFlash = Date.now() + 2000 + Math.random() * 4000;

    const drawBolt = (x, y0) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.moveTo(x, y0);

      let cx = x, cy = y0;
      const segments = 6 + Math.floor(Math.random() * 5);
      for (let i = 0; i < segments; i++) {
        cx += -20 + Math.random() * 40;
        cy += canvas.height / segments;
        ctx.lineTo(cx, cy);
      }
      ctx.strokeStyle = 'rgba(200,180,255,0.6)';
      ctx.lineWidth   = 1.5;
      ctx.shadowColor = 'rgba(180,160,255,0.8)';
      ctx.shadowBlur  = 12;
      ctx.stroke();

      setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 120);
    };

    const loop = () => {
      if (Date.now() >= nextFlash) {
        drawBolt(canvas.width * 0.2 + Math.random() * canvas.width * 0.6, 0);
        nextFlash = Date.now() + 2000 + Math.random() * 5000;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

// ── Clouds / Mist ─────────────────────────────────────────
function MistLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {[0, 1, 2, 3].map(i => (
        <div
          key={i}
          className="absolute w-[220%] bg-white/[0.04] blur-[70px] rounded-full"
          style={{
            height:          '35%',
            top:             `${i * 22}%`,
            left:            '-60%',
            animation:       `float ${16 + i * 4}s ease-in-out infinite`,
            animationDelay:  `${-i * 3}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Clear / Sunny ─────────────────────────────────────────
function SunLayer() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute -top-24 -right-16 w-72 h-72 bg-amber-200/8 blur-[90px] rounded-full weather-sun-ray" />
      <div className="absolute top-12 right-12 w-32 h-32 bg-amber-400/6 blur-[50px] rounded-full weather-sun-ray" style={{ animationDelay: '-4s' }} />
    </div>
  );
}

// ── Main export ───────────────────────────────────────────
export default function WeatherParticles({ condition = 'clear', intensity = 22 }) {
  const c = condition.toLowerCase();

  if (c.includes('thunderstorm')) {
    return (
      <>
        <RainLayer intensity={Math.round(intensity * 1.4)} />
        <LightningCanvas />
      </>
    );
  }
  if (c.includes('drizzle')) return <RainLayer intensity={Math.round(intensity * 0.6)} />;
  if (c.includes('rain'))    return <RainLayer intensity={intensity} />;
  if (c.includes('snow'))    return <SnowLayer intensity={intensity} />;
  if (c.includes('cloud') || c.includes('mist') || c.includes('fog') || c.includes('haze')) return <MistLayer />;
  if (c.includes('clear'))   return <SunLayer />;
  return null;
}
