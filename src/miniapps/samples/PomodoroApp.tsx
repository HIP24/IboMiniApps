import { useEffect, useMemo, useRef, useState } from "react";
import type { MiniAppDefinition } from "../types";

type SessionType = "focus" | "break";

type PomodoroSettings = {
  focusMinutes: number;
  breakMinutes: number;
  rounds: number;
};

function Pomodoro() {
  const [settings, setSettings] = useState<PomodoroSettings>({
    focusMinutes: 25,
    breakMinutes: 5,
    rounds: 4
  });
  const [isRunning, setIsRunning] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType>("focus");
  const [round, setRound] = useState(1);
  const [secondsRemaining, setSecondsRemaining] = useState(settings.focusMinutes * 60);
  const intervalRef = useRef<number | null>(null);

  const totalSeconds = useMemo(() => {
    return sessionType === "focus"
      ? settings.focusMinutes * 60
      : settings.breakMinutes * 60;
  }, [sessionType, settings]);

  const progress = useMemo(() => {
    return 1 - secondsRemaining / totalSeconds;
  }, [secondsRemaining, totalSeconds]);

  useEffect(() => {
    if (!isRunning) {
      return () => undefined;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalRef.current ?? undefined);
          intervalRef.current = null;
          handleSessionComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning]);

  useEffect(() => {
    setSecondsRemaining(
      sessionType === "focus"
        ? settings.focusMinutes * 60
        : settings.breakMinutes * 60
    );
  }, [sessionType, settings]);

  const resetTimer = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    setSessionType("focus");
    setRound(1);
    setSecondsRemaining(settings.focusMinutes * 60);
  };

  const handleSessionComplete = () => {
    if (sessionType === "focus") {
      if (round >= settings.rounds) {
        setSessionType("break");
        setRound(1);
      } else {
        setSessionType("break");
      }
    } else {
      if (round >= settings.rounds) {
        setSessionType("focus");
        setRound(1);
      } else {
        setSessionType("focus");
        setRound((prev) => prev + 1);
      }
    }
    setIsRunning(false);
  };

  const toggleTimer = () => {
    setIsRunning((prev) => !prev);
  };

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secondsRemaining % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [secondsRemaining]);

  return (
    <div className="pomodoro">
      <header className="pomodoro__header">
        <span className={`pomodoro__status pomodoro__status--${sessionType}`}>
          {sessionType === "focus" ? "Focus" : "Break"}
        </span>
        <span className="pomodoro__round">Round {round} of {settings.rounds}</span>
      </header>

      <div className="pomodoro__timer">
        <svg viewBox="0 0 100 100" className="pomodoro__timer-visual">
          <circle className="pomodoro__timer-bg" cx="50" cy="50" r="45" />
          <circle
            className="pomodoro__timer-progress"
            cx="50"
            cy="50"
            r="45"
            style={{
              strokeDasharray: 2 * Math.PI * 45,
              strokeDashoffset: (1 - progress) * 2 * Math.PI * 45
            }}
          />
        </svg>
        <span className="pomodoro__time" role="timer" aria-live="polite">
          {formattedTime}
        </span>
      </div>

      <div className="pomodoro__controls">
        <button type="button" onClick={toggleTimer}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button type="button" onClick={resetTimer}>
          Reset
        </button>
      </div>

      <details className="pomodoro__settings">
        <summary>Settings</summary>
        <div className="pomodoro__settings-grid">
          <label>
            Focus minutes
            <input
              type="number"
              min={1}
              max={120}
              value={settings.focusMinutes}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  focusMinutes: Number(event.target.value)
                }))
              }
            />
          </label>
          <label>
            Break minutes
            <input
              type="number"
              min={1}
              max={60}
              value={settings.breakMinutes}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  breakMinutes: Number(event.target.value)
                }))
              }
            />
          </label>
          <label>
            Rounds
            <input
              type="number"
              min={1}
              max={12}
              value={settings.rounds}
              onChange={(event) =>
                setSettings((prev) => ({
                  ...prev,
                  rounds: Number(event.target.value)
                }))
              }
            />
          </label>
        </div>
      </details>
    </div>
  );
}

export const PomodoroApp: MiniAppDefinition = {
  id: "pomodoro",
  name: "Pomodoro",
  description: "Stay focused with timed work sessions.",
  icon: "⏱️",
  component: Pomodoro
};
