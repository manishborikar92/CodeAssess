"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Hook for countdown timer with 1-second resolution.
 * Uses real-time elapsed calculation from startTime for accuracy.
 */
export function useTimer({ startTime, totalSeconds, isRunning, onTick, onTimeUp }) {
  const intervalRef = useRef(null);
  const timeUpCalledRef = useRef(false);

  const formatTime = useCallback((seconds) => {
    const s = Math.max(0, seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sc = s % 60;
    if (h > 0)
      return `${h}:${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sc).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (!isRunning || !startTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    timeUpCalledRef.current = false;

    const tick = () => {
      const elapsed = Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000
      );
      const remaining = Math.max(0, totalSeconds - elapsed);

      if (onTick) onTick({ remaining, elapsed });

      if (remaining <= 0 && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (onTimeUp) onTimeUp();
      }
    };

    tick(); // Initial tick
    intervalRef.current = setInterval(tick, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, startTime, totalSeconds, onTick, onTimeUp]);

  return { formatTime };
}
