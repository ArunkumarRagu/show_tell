import { useEffect, useRef, useState } from 'react';
import { Monitor } from 'lucide-react';
import { TIMER_CHANNEL, playTickSound, playAlertSound } from '@/context/TimerContext';
import type { TimerMessage, TimerState, TimerStatus } from '@/context/TimerContext';

// ── helpers ───────────────────────────────────────────────────────────────────

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// ── SVG circular progress ─────────────────────────────────────────────────────

function CircularRing({
  remaining,
  duration,
  isWarning,
  isFinished,
}: {
  remaining: number;
  duration: number;
  isWarning: boolean;
  isFinished: boolean;
}) {
  const radius = 180;
  const circumference = 2 * Math.PI * radius;
  const progress = duration > 0 ? remaining / duration : 0;
  const offset = circumference * (1 - progress);

  const ringColor = isFinished
    ? '#EF4444'
    : isWarning
    ? '#F97316'
    : '#7C3AED';

  const glowColor = isFinished
    ? 'rgba(239,68,68,0.6)'
    : isWarning
    ? 'rgba(249,115,22,0.6)'
    : 'rgba(124,58,237,0.4)';

  return (
    <svg width="420" height="420" viewBox="0 0 420 420" className="drop-shadow-2xl">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* track */}
      <circle
        cx="210"
        cy="210"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="18"
      />
      {/* progress arc */}
      <circle
        cx="210"
        cy="210"
        r={radius}
        fill="none"
        stroke={ringColor}
        strokeWidth="18"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 210 210)"
        style={{
          transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s ease',
          filter: `drop-shadow(0 0 14px ${glowColor})`,
        }}
      />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function BigScreenTimerPage() {
  const [timerState, setTimerState] = useState<TimerState>({
    activity: null,
    target: null,
    duration: 300,
    remaining: 300,
    status: 'idle' as TimerStatus,
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const prevRemainingRef = useRef<number>(300);
  const [flash, setFlash] = useState(false);
  const [showBurst, setShowBurst] = useState(false);

  const isWarning = timerState.remaining <= 10 && timerState.remaining > 0 && timerState.status === 'running';
  const isFinished = timerState.status === 'finished';
  const isRunning = timerState.status === 'running';

  // ── BroadcastChannel listener ──────────────────────────────────────────────

  useEffect(() => {
    const ch = new BroadcastChannel(TIMER_CHANNEL);
    channelRef.current = ch;

    // Ask the admin tab to sync
    ch.postMessage({ type: 'SYNC' } as TimerMessage);

    ch.onmessage = (e: MessageEvent<TimerMessage>) => {
      const msg = e.data;

      switch (msg.type) {
        case 'SYNC':
          setTimerState(msg.state);
          prevRemainingRef.current = msg.state.remaining;
          break;
        case 'START':
          setTimerState(msg.state);
          prevRemainingRef.current = msg.state.remaining;
          break;
        case 'TICK': {
          const rem = msg.remaining;
          setTimerState((s) => ({ ...s, remaining: rem, status: 'running' }));
          if (rem <= 10 && rem > 0) {
            playTickSound();
            // flash the number
            setFlash(true);
            setTimeout(() => setFlash(false), 250);
          }
          prevRemainingRef.current = rem;
          break;
        }
        case 'PAUSE':
          setTimerState((s) => ({ ...s, remaining: msg.remaining, status: 'paused' }));
          break;
        case 'RESUME':
          setTimerState((s) => ({ ...s, remaining: msg.remaining, status: 'running' }));
          break;
        case 'RESET':
          setTimerState((s) => ({ ...s, remaining: s.duration, status: 'idle' }));
          setShowBurst(false);
          break;
        case 'FINISH':
          setTimerState((s) => ({ ...s, remaining: 0, status: 'finished' }));
          playAlertSound();
          setShowBurst(true);
          break;
      }
    };

    return () => {
      ch.close();
      channelRef.current = null;
    };
  }, []);

  // ── Burst particles ────────────────────────────────────────────────────────

  const particles = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center"
      style={{
        background: isFinished
          ? 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.18) 0%, #0B0E17 60%)'
          : isWarning
          ? 'radial-gradient(circle at 50% 50%, rgba(249,115,22,0.15) 0%, #0B0E17 60%)'
          : 'radial-gradient(circle at 50% 50%, rgba(124,58,237,0.12) 0%, #0B0E17 60%)',
        transition: 'background 1s ease',
      }}
    >
      {/* Animated background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Burst particles */}
      {showBurst &&
        particles.map((i) => {
          const angle = (i / particles.length) * 360;
          const dist = 220 + Math.random() * 120;
          return (
            <div
              key={i}
              className="pointer-events-none absolute rounded-full"
              style={{
                width: `${6 + Math.random() * 8}px`,
                height: `${6 + Math.random() * 8}px`,
                top: '50%',
                left: '50%',
                background: `hsl(${Math.random() * 360}, 90%, 65%)`,
                animation: `burst-particle 1.2s ease-out forwards`,
                transform: `rotate(${angle}deg) translateX(0)`,
                '--dist': `${dist}px`,
              } as React.CSSProperties}
            />
          );
        })}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">

        {/* Activity name */}
        {timerState.activity ? (
          <div className="space-y-1">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Activity
            </p>
            <h1
              className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {timerState.activity.name}
            </h1>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-slate-600">
            <Monitor className="h-8 w-8" />
            <span className="text-xl font-medium">Waiting for Admin…</span>
          </div>
        )}

        {/* Target (group/user) */}
        {timerState.target && (
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 backdrop-blur">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: timerState.target.color ?? '#7C3AED' }}
            />
            <span className="text-lg font-semibold text-white">
              {timerState.target.name}
            </span>
          </div>
        )}

        {/* Circular ring + countdown */}
        <div className="relative flex items-center justify-center">
          <CircularRing
            remaining={timerState.remaining}
            duration={timerState.duration}
            isWarning={isWarning}
            isFinished={isFinished}
          />

          {/* Center content */}
          <div className="absolute flex flex-col items-center justify-center">
            {isFinished ? (
              <div
                className="flex flex-col items-center"
                style={{ animation: 'time-up-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}
              >
                <span
                  className="text-5xl font-black tracking-tight text-red-400 sm:text-6xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  TIME'S
                </span>
                <span
                  className="text-5xl font-black tracking-tight text-red-400 sm:text-6xl"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  UP!
                </span>
              </div>
            ) : (
              <>
                <span
                  className="font-mono font-black leading-none tabular-nums"
                  style={{
                    fontSize: 'clamp(3.5rem, 8vw, 6rem)',
                    color: isWarning ? '#F97316' : '#F8FAFC',
                    animation: flash ? 'flash-pulse 0.25s ease' : undefined,
                    textShadow: isWarning
                      ? '0 0 30px rgba(249,115,22,0.8)'
                      : '0 0 20px rgba(124,58,237,0.4)',
                  }}
                >
                  {fmt(timerState.remaining)}
                </span>
                {isWarning && (
                  <span className="mt-1 text-sm font-bold uppercase tracking-widest text-orange-400">
                    FINAL COUNTDOWN
                  </span>
                )}
                {timerState.status === 'paused' && (
                  <span className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
                    ⏸ Paused
                  </span>
                )}
                {timerState.status === 'idle' && timerState.activity && (
                  <span className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-500">
                    Ready
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pulsing ring (warning mode) */}
        {isWarning && (
          <div
            className="pointer-events-none absolute rounded-full border-2 border-orange-500/40"
            style={{
              width: '460px',
              height: '460px',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%) translateY(-60px)',
              animation: 'warning-pulse 0.8s ease-in-out infinite',
            }}
          />
        )}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-6 right-8 flex items-center gap-2 opacity-30">
        <Monitor className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-medium text-slate-400 tracking-widest uppercase">
          HAT Converse · Big Screen
        </span>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes flash-pulse {
          0%   { transform: scale(1); }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes time-up-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.15); opacity: 1; }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes warning-pulse {
          0%   { transform: translate(-50%, -50%) translateY(-60px) scale(1);    opacity: 0.6; }
          50%  { transform: translate(-50%, -50%) translateY(-60px) scale(1.05); opacity: 0.3; }
          100% { transform: translate(-50%, -50%) translateY(-60px) scale(1);    opacity: 0.6; }
        }
        @keyframes burst-particle {
          0%   { transform: rotate(var(--angle,0deg)) translateX(0)            scale(1);   opacity: 1; }
          100% { transform: rotate(var(--angle,0deg)) translateX(var(--dist))  scale(0);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}
