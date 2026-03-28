"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Countdown timer based on an existing elapsed duration.
 * The caller owns the source of truth; this hook only provides live ticks.
 */
export function useTimer({
  durationSeconds = 0,
  elapsedSeconds = 0,
  isRunning,
  onTick,
  onTimeUp,
}) {
  const intervalRef = useRef(null);
  const timeUpCalledRef = useRef(false);

  const formatTime = useCallback((seconds) => {
    const safeSeconds = Math.max(0, seconds);
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const remainingSeconds = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(
        remainingSeconds
      ).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    const tick = (currentElapsedSeconds) => {
      const normalizedElapsed = Math.min(durationSeconds, currentElapsedSeconds);
      const remaining = Math.max(0, durationSeconds - normalizedElapsed);

      onTick?.({
        elapsed: normalizedElapsed,
        remaining,
      });

      if (remaining === 0 && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        onTimeUp?.();
      }
    };

    timeUpCalledRef.current = false;

    if (!isRunning) {
      tick(elapsedSeconds);
      return undefined;
    }

    const startedAt = Date.now();

    const liveTick = () => {
      const liveElapsedSeconds =
        elapsedSeconds + Math.floor((Date.now() - startedAt) / 1000);
      tick(liveElapsedSeconds);
    };

    liveTick();
    intervalRef.current = setInterval(liveTick, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [durationSeconds, elapsedSeconds, isRunning, onTick, onTimeUp]);

  return { formatTime };
}
