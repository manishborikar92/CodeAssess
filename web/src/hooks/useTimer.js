"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Countdown timer hook based on an existing elapsed duration.
 * 
 * The caller owns the source of truth for elapsed time; this hook provides
 * live tick updates and remaining time calculations.
 * 
 * @param {Object} config - Timer configuration
 * @param {number} config.durationSeconds - Total duration in seconds
 * @param {number} config.elapsedSeconds - Already elapsed seconds
 * @param {boolean} config.isRunning - Whether the timer is actively running
 * @param {Function} [config.onTick] - Callback fired on each tick with {elapsed, remaining}
 * @param {Function} [config.onTimeUp] - Callback fired when timer reaches zero
 * @returns {Object} Timer state and utilities
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
  const startTimeRef = useRef(null);
  
  // Use refs for callbacks to avoid effect re-runs while keeping them current
  const onTickRef = useRef(onTick);
  const onTimeUpRef = useRef(onTimeUp);

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, durationSeconds - elapsedSeconds)
  );

  // Keep callback refs synchronized without triggering effects
  useEffect(() => {
    onTickRef.current = onTick;
  }, [onTick]);

  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Memoized time formatter
  const formatTime = useCallback((seconds) => {
    const safeSeconds = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(safeSeconds / 3600);
    const minutes = Math.floor((safeSeconds % 3600) / 60);
    const secs = safeSeconds % 60;

    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }, []);

  // Main timer effect
  useEffect(() => {
    // Calculate current state and update UI
    const tick = (currentElapsedSeconds) => {
      const normalizedElapsed = Math.min(durationSeconds, currentElapsedSeconds);
      const remaining = Math.max(0, durationSeconds - normalizedElapsed);

      setRemainingSeconds(remaining);

      // Notify parent of tick
      if (onTickRef.current) {
        onTickRef.current({
          elapsed: normalizedElapsed,
          remaining,
        });
      }

      // Handle timer expiration (only once)
      if (remaining === 0 && !timeUpCalledRef.current) {
        timeUpCalledRef.current = true;
        
        // Clear interval before calling callback to prevent race conditions
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        if (onTimeUpRef.current) {
          onTimeUpRef.current();
        }
      }
    };

    // Reset time-up flag when timer parameters change
    timeUpCalledRef.current = false;

    // If not running, just update the display once
    if (!isRunning) {
      tick(elapsedSeconds);
      return undefined;
    }

    // Start the timer
    startTimeRef.current = Date.now();

    const liveTick = () => {
      const liveElapsedSeconds =
        elapsedSeconds + Math.floor((Date.now() - startTimeRef.current) / 1000);
      tick(liveElapsedSeconds);
    };

    // Initial tick
    liveTick();

    // Set up interval for subsequent ticks
    intervalRef.current = setInterval(liveTick, 1000);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [durationSeconds, elapsedSeconds, isRunning]);

  return { 
    formatTime, 
    remainingSeconds 
  };
}
