import { useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Particles } from '@/components/ui/particles';
import { Meteors } from '@/components/ui/meteors';
import { ShootingStars } from '@/components/ui/shooting-stars';
import { BackgroundBeams } from '@/components/ui/background-beams';

interface WeatherBackgroundProps {
  weatherCode: number | null;
  isDay: boolean | null;
  children: React.ReactNode;
}

type WeatherTheme = {
  gradient: string;
  particleColor: string;
  particleCount: number;
  particleVx: number;
  particleVy: number;
  particleSize: number;
  effect: 'none' | 'rain' | 'snow' | 'storm' | 'fog' | 'night' | 'meteors';
  textColor: string;
};

function getWeatherTheme(code: number | null, isDay: boolean | null): WeatherTheme {
  // Loading state — neutral blue gradient
  if (code === null || isDay === null) {
    return {
      gradient: 'linear-gradient(180deg, #1e3a5f 0%, #2563eb 40%, #3b82f6 100%)',
      particleColor: '#e2e8f0',
      particleCount: 40,
      particleVx: 0,
      particleVy: 0,
      particleSize: 0.5,
      effect: 'none',
      textColor: '#ffffff',
    };
  }

  // Clear sky
  if (code === 0) {
    if (isDay) {
      return {
        gradient: 'linear-gradient(180deg, #0ea5e9 0%, #38bdf8 40%, #7dd3fc 100%)',
        particleColor: '#fbbf24',
        particleCount: 30,
        particleVx: 0,
        particleVy: 0,
        particleSize: 1.2,
        effect: 'none',
        textColor: '#ffffff',
      };
    }
    return {
      gradient: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 40%, #312e81 100%)',
      particleColor: '#e2e8f0',
      particleCount: 80,
      particleVx: 0,
      particleVy: 0,
      particleSize: 0.5,
      effect: 'night',
      textColor: '#e2e8f0',
    };
  }

  // Mainly clear / Partly cloudy
  if (code <= 2) {
    if (isDay) {
      return {
        gradient: 'linear-gradient(180deg, #38bdf8 0%, #93c5fd 50%, #bae6fd 100%)',
        particleColor: '#ffffff',
        particleCount: 20,
        particleVx: 0.2,
        particleVy: 0,
        particleSize: 0.8,
        effect: 'none',
        textColor: '#1e3a5f',
      };
    }
    return {
      gradient: 'linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)',
      particleColor: '#cbd5e1',
      particleCount: 50,
      particleVx: 0,
      particleVy: 0,
      particleSize: 0.5,
      effect: 'night',
      textColor: '#e2e8f0',
    };
  }

  // Overcast
  if (code === 3) {
    return {
      gradient: isDay
        ? 'linear-gradient(180deg, #94a3b8 0%, #cbd5e1 50%, #e2e8f0 100%)'
        : 'linear-gradient(180deg, #334155 0%, #475569 50%, #64748b 100%)',
      particleColor: '#94a3b8',
      particleCount: 40,
      particleVx: 0.5,
      particleVy: 0,
      particleSize: 0.6,
      effect: 'fog',
      textColor: isDay ? '#1e293b' : '#e2e8f0',
    };
  }

  // Fog
  if (code <= 48) {
    return {
      gradient: isDay
        ? 'linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 50%, #f1f5f9 100%)'
        : 'linear-gradient(180deg, #475569 0%, #64748b 50%, #94a3b8 100%)',
      particleColor: '#e2e8f0',
      particleCount: 60,
      particleVx: 0.3,
      particleVy: 0.1,
      particleSize: 1.5,
      effect: 'fog',
      textColor: isDay ? '#334155' : '#f1f5f9',
    };
  }

  // Drizzle
  if (code <= 55) {
    return {
      gradient: isDay
        ? 'linear-gradient(180deg, #64748b 0%, #94a3b8 40%, #cbd5e1 100%)'
        : 'linear-gradient(180deg, #1e293b 0%, #334155 40%, #475569 100%)',
      particleColor: '#93c5fd',
      particleCount: 80,
      particleVx: 0.3,
      particleVy: 2,
      particleSize: 0.3,
      effect: 'rain',
      textColor: '#ffffff',
    };
  }

  // Rain
  if (code <= 65) {
    return {
      gradient: isDay
        ? 'linear-gradient(180deg, #475569 0%, #64748b 30%, #94a3b8 100%)'
        : 'linear-gradient(180deg, #0f172a 0%, #1e293b 30%, #334155 100%)',
      particleColor: '#60a5fa',
      particleCount: 150,
      particleVx: 0.5,
      particleVy: 4,
      particleSize: 0.3,
      effect: 'rain',
      textColor: '#ffffff',
    };
  }

  // Snow
  if (code <= 75) {
    return {
      gradient: isDay
        ? 'linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 50%, #ffffff 100%)'
        : 'linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)',
      particleColor: '#ffffff',
      particleCount: 100,
      particleVx: 0.3,
      particleVy: 0.8,
      particleSize: 1.2,
      effect: 'snow',
      textColor: isDay ? '#334155' : '#f1f5f9',
    };
  }

  // Showers
  if (code <= 82) {
    return {
      gradient: 'linear-gradient(180deg, #334155 0%, #475569 30%, #64748b 100%)',
      particleColor: '#60a5fa',
      particleCount: 200,
      particleVx: 1,
      particleVy: 5,
      particleSize: 0.3,
      effect: 'rain',
      textColor: '#ffffff',
    };
  }

  // Thunderstorm
  return {
    gradient: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 30%, #312e81 60%, #1e293b 100%)',
    particleColor: '#60a5fa',
    particleCount: 200,
    particleVx: 1.5,
    particleVy: 6,
    particleSize: 0.4,
    effect: 'storm',
    textColor: '#e2e8f0',
  };
}

export function WeatherBackground({ weatherCode, isDay, children }: WeatherBackgroundProps) {
  const theme = useMemo(() => getWeatherTheme(weatherCode, isDay), [weatherCode, isDay]);
  const key = `${weatherCode}-${isDay}`;

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ color: theme.textColor }}>
      {/* Animated gradient background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          className="absolute inset-0 z-0"
          style={{ background: theme.gradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* Weather particle effects */}
      <div className="absolute inset-0 z-[1]">
        {/* Rain / Drizzle / Showers / Storm particles */}
        {(theme.effect === 'rain' || theme.effect === 'storm') && (
          <Particles
            key={`particles-${key}`}
            className="absolute inset-0 h-full w-full"
            quantity={theme.particleCount}
            color={theme.particleColor}
            vx={theme.particleVx}
            vy={theme.particleVy}
            size={theme.particleSize}
            staticity={5}
            ease={80}
          />
        )}

        {/* Snow */}
        {theme.effect === 'snow' && (
          <Particles
            key={`snow-${key}`}
            className="absolute inset-0 h-full w-full"
            quantity={theme.particleCount}
            color={theme.particleColor}
            vx={theme.particleVx}
            vy={theme.particleVy}
            size={theme.particleSize}
            staticity={30}
            ease={40}
          />
        )}

        {/* Fog particles - slow, large, drifting */}
        {theme.effect === 'fog' && (
          <Particles
            key={`fog-${key}`}
            className="absolute inset-0 h-full w-full opacity-60"
            quantity={theme.particleCount}
            color={theme.particleColor}
            vx={theme.particleVx}
            vy={theme.particleVy}
            size={theme.particleSize}
            staticity={80}
            ease={20}
          />
        )}

        {/* Clear day - subtle floating particles */}
        {theme.effect === 'none' && (
          <Particles
            key={`clear-${key}`}
            className="absolute inset-0 h-full w-full opacity-40"
            quantity={theme.particleCount}
            color={theme.particleColor}
            vx={theme.particleVx}
            vy={theme.particleVy}
            size={theme.particleSize}
            staticity={60}
            ease={30}
          />
        )}

        {/* Night sky - shooting stars */}
        {theme.effect === 'night' && (
          <>
            <Particles
              key={`stars-${key}`}
              className="absolute inset-0 h-full w-full"
              quantity={theme.particleCount}
              color={theme.particleColor}
              size={theme.particleSize}
              staticity={100}
              ease={10}
            />
            <ShootingStars
              minSpeed={15}
              maxSpeed={35}
              minDelay={2000}
              maxDelay={5000}
              starColor="#c4b5fd"
              trailColor="#7c3aed"
              starWidth={12}
              starHeight={1}
              className="absolute inset-0"
            />
          </>
        )}

        {/* Thunderstorm - beams + lightning flash + meteors */}
        {theme.effect === 'storm' && (
          <>
            <BackgroundBeams className="opacity-30" />
            <Meteors
              number={6}
              className="opacity-70"
            />
            {/* Lightning flash overlay */}
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              animate={{
                opacity: [0, 0, 0, 0.6, 0, 0.3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: Math.random() * 3 + 2,
                ease: 'linear',
              }}
            />
          </>
        )}
      </div>

      {/* Content layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
