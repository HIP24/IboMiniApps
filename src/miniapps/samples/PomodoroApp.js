import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
function Pomodoro() {
    const [settings, setSettings] = useState({
        focusMinutes: 25,
        breakMinutes: 5,
        rounds: 4
    });
    const [isRunning, setIsRunning] = useState(false);
    const [sessionType, setSessionType] = useState("focus");
    const [round, setRound] = useState(1);
    const [secondsRemaining, setSecondsRemaining] = useState(settings.focusMinutes * 60);
    const intervalRef = useRef(null);
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
        setSecondsRemaining(sessionType === "focus"
            ? settings.focusMinutes * 60
            : settings.breakMinutes * 60);
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
            }
            else {
                setSessionType("break");
            }
        }
        else {
            if (round >= settings.rounds) {
                setSessionType("focus");
                setRound(1);
            }
            else {
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
    return (_jsxs("div", { className: "pomodoro", children: [_jsxs("header", { className: "pomodoro__header", children: [_jsx("span", { className: `pomodoro__status pomodoro__status--${sessionType}`, children: sessionType === "focus" ? "Focus" : "Break" }), _jsxs("span", { className: "pomodoro__round", children: ["Round ", round, " of ", settings.rounds] })] }), _jsxs("div", { className: "pomodoro__timer", children: [_jsxs("svg", { viewBox: "0 0 100 100", className: "pomodoro__timer-visual", children: [_jsx("circle", { className: "pomodoro__timer-bg", cx: "50", cy: "50", r: "45" }), _jsx("circle", { className: "pomodoro__timer-progress", cx: "50", cy: "50", r: "45", style: {
                                    strokeDasharray: 2 * Math.PI * 45,
                                    strokeDashoffset: (1 - progress) * 2 * Math.PI * 45
                                } })] }), _jsx("span", { className: "pomodoro__time", role: "timer", "aria-live": "polite", children: formattedTime })] }), _jsxs("div", { className: "pomodoro__controls", children: [_jsx("button", { type: "button", onClick: toggleTimer, children: isRunning ? "Pause" : "Start" }), _jsx("button", { type: "button", onClick: resetTimer, children: "Reset" })] }), _jsxs("details", { className: "pomodoro__settings", children: [_jsx("summary", { children: "Settings" }), _jsxs("div", { className: "pomodoro__settings-grid", children: [_jsxs("label", { children: ["Focus minutes", _jsx("input", { type: "number", min: 1, max: 120, value: settings.focusMinutes, onChange: (event) => setSettings((prev) => ({
                                            ...prev,
                                            focusMinutes: Number(event.target.value)
                                        })) })] }), _jsxs("label", { children: ["Break minutes", _jsx("input", { type: "number", min: 1, max: 60, value: settings.breakMinutes, onChange: (event) => setSettings((prev) => ({
                                            ...prev,
                                            breakMinutes: Number(event.target.value)
                                        })) })] }), _jsxs("label", { children: ["Rounds", _jsx("input", { type: "number", min: 1, max: 12, value: settings.rounds, onChange: (event) => setSettings((prev) => ({
                                            ...prev,
                                            rounds: Number(event.target.value)
                                        })) })] })] })] })] }));
}
export const PomodoroApp = {
    id: "pomodoro",
    name: "Pomodoro",
    description: "Stay focused with timed work sessions.",
    icon: "⏱️",
    component: Pomodoro
};
