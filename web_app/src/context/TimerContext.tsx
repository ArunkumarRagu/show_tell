import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { Activity, User, Team } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerTarget {
  type: 'user' | 'group';
  id: string;
  name: string;
  color?: string;
}

export interface TimerState {
  activity: Activity | null;
  target: TimerTarget | null;
  duration: number;       // total seconds set by admin
  remaining: number;      // seconds left
  status: TimerStatus;
}

interface TimerContextValue extends TimerState {
  setActivity: (a: Activity | null) => void;
  setTarget: (t: TimerTarget | null) => void;
  setDuration: (d: number) => void;
  start: () => void;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

// ── BroadcastChannel message types ────────────────────────────────────────────

export type TimerMessage =
  | { type: 'SYNC'; state: TimerState }
  | { type: 'TICK'; remaining: number }
  | { type: 'START'; state: TimerState }
  | { type: 'PAUSE'; remaining: number }
  | { type: 'RESUME'; remaining: number }
  | { type: 'RESET' }
  | { type: 'FINISH' };

export const TIMER_CHANNEL = 'hat-timer-v1';

// ── Web Audio helpers ──────────────────────────────────────────────────────────

function getAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch {
    return null;
  }
}

export function playTickSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0.4, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.12);
}

export function playAlertSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const freqs = [659, 523, 392];
  freqs.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'triangle';
    const t = ctx.currentTime + i * 0.18;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    osc.start(t);
    osc.stop(t + 0.36);
  });
}

// ── Context ───────────────────────────────────────────────────────────────────

const TimerContext = createContext<TimerContextValue | null>(null);

const defaultState: TimerState = {
  activity: null,
  target: null,
  duration: 300,
  remaining: 300,
  status: 'idle',
};

export function TimerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<TimerState>(defaultState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Open broadcast channel once
  useEffect(() => {
    channelRef.current = new BroadcastChannel(TIMER_CHANNEL);
    // When a new big-screen tab opens, it requests SYNC
    channelRef.current.onmessage = (e: MessageEvent<TimerMessage>) => {
      if (e.data.type === 'SYNC') {
        // Big screen sent a SYNC request – reply with current state
        channelRef.current?.postMessage({ type: 'SYNC', state: stateRef.current });
      }
    };
    return () => {
      channelRef.current?.close();
      channelRef.current = null;
    };
  }, []);

  const broadcast = useCallback((msg: TimerMessage) => {
    channelRef.current?.postMessage(msg);
  }, []);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = useCallback((initialRemaining: number) => {
    clearTimer();
    let rem = initialRemaining;
    intervalRef.current = setInterval(() => {
      rem -= 1;
      if (rem <= 0) {
        rem = 0;
        clearTimer();
        setState((s) => ({ ...s, remaining: 0, status: 'finished' }));
        broadcast({ type: 'FINISH' });
      } else {
        setState((s) => ({ ...s, remaining: rem }));
        broadcast({ type: 'TICK', remaining: rem });
      }
    }, 1000);
  }, [broadcast]);

  // ── Public actions ───────────────────────────────────────────────────────────

  const setActivity = useCallback((a: Activity | null) => {
    setState((s) => ({
      ...s,
      activity: a,
      duration: a?.timeLimit ?? s.duration,
      remaining: a?.timeLimit ?? s.duration,
      status: 'idle',
      target: null,
    }));
    clearTimer();
  }, []);

  const setTarget = useCallback((t: TimerTarget | null) => {
    setState((s) => ({ ...s, target: t }));
  }, []);

  const setDuration = useCallback((d: number) => {
    setState((s) => ({ ...s, duration: d, remaining: d }));
  }, []);

  const start = useCallback(() => {
    setState((s) => {
      const newState = { ...s, status: 'running' as TimerStatus };
      broadcast({ type: 'START', state: newState });
      return newState;
    });
    startInterval(stateRef.current.remaining);
  }, [broadcast, startInterval]);

  const pause = useCallback(() => {
    clearTimer();
    setState((s) => {
      broadcast({ type: 'PAUSE', remaining: s.remaining });
      return { ...s, status: 'paused' };
    });
  }, [broadcast]);

  const resume = useCallback(() => {
    setState((s) => {
      broadcast({ type: 'RESUME', remaining: s.remaining });
      startInterval(s.remaining);
      return { ...s, status: 'running' };
    });
  }, [broadcast, startInterval]);

  const reset = useCallback(() => {
    clearTimer();
    setState((s) => {
      const newState = { ...s, remaining: s.duration, status: 'idle' };
      broadcast({ type: 'RESET' });
      return newState;
    });
  }, [broadcast]);

  useEffect(() => () => clearTimer(), []);

  return (
    <TimerContext.Provider value={{ ...state, setActivity, setTarget, setDuration, start, pause, resume, reset }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used inside <TimerProvider>');
  return ctx;
}
