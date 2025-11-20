import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
const operators = ["+", "-", "*", "/"];
function Calculator() {
    const [display, setDisplay] = useState("0");
    const [pending, setPending] = useState(null);
    const [shouldReset, setShouldReset] = useState(false);
    const appendDigit = (digit) => {
        setDisplay((prev) => {
            if (shouldReset || prev === "0") {
                setShouldReset(false);
                return digit;
            }
            return prev + digit;
        });
    };
    const appendDecimal = () => {
        setDisplay((prev) => {
            if (shouldReset) {
                setShouldReset(false);
                return "0.";
            }
            if (!prev.includes(".")) {
                return prev + ".";
            }
            return prev;
        });
    };
    const clearAll = () => {
        setDisplay("0");
        setPending(null);
        setShouldReset(false);
    };
    const performPending = (nextOperator) => {
        if (!pending) {
            setPending({
                left: parseFloat(display),
                operator: nextOperator ?? "+"
            });
            setShouldReset(true);
            return;
        }
        const current = parseFloat(display);
        const { operator, left } = pending;
        let result = current;
        switch (operator) {
            case "+":
                result = left + current;
                break;
            case "-":
                result = left - current;
                break;
            case "*":
                result = left * current;
                break;
            case "/":
                result = current === 0 ? NaN : left / current;
                break;
            default:
                break;
        }
        const resultDisplay = Number.isFinite(result) ? result.toString() : "Error";
        setDisplay(resultDisplay);
        setShouldReset(true);
        if (nextOperator) {
            setPending({
                left: Number.isFinite(result) ? result : 0,
                operator: nextOperator
            });
        }
        else {
            setPending(null);
        }
    };
    const handleOperator = (operator) => {
        if (shouldReset) {
            setPending((prev) => prev
                ? {
                    left: prev.left,
                    operator
                }
                : {
                    left: parseFloat(display),
                    operator
                });
            return;
        }
        if (!pending) {
            setPending({
                left: parseFloat(display),
                operator
            });
            setShouldReset(true);
            return;
        }
        performPending(operator);
    };
    const handleEquals = () => {
        performPending();
    };
    const toggleSign = () => {
        setDisplay((prev) => {
            if (prev === "0" || prev === "Error") {
                return prev;
            }
            return prev.startsWith("-") ? prev.slice(1) : `-${prev}`;
        });
    };
    const percent = () => {
        setDisplay((prev) => {
            const value = parseFloat(prev);
            if (!Number.isFinite(value)) {
                return prev;
            }
            return (value / 100).toString();
        });
    };
    return (_jsxs("div", { className: "calculator", children: [_jsx("div", { className: "calculator__display", role: "status", children: display }), _jsxs("div", { className: "calculator__grid", role: "group", "aria-label": "Calculator keypad", children: [_jsx("button", { type: "button", onClick: clearAll, children: "C" }), _jsx("button", { type: "button", onClick: toggleSign, children: "\u00B1" }), _jsx("button", { type: "button", onClick: percent, children: "%" }), _jsx("button", { type: "button", onClick: () => handleOperator("/"), "aria-label": "Divide", children: "\u00F7" }), ["7", "8", "9"].map((n) => (_jsx("button", { type: "button", onClick: () => appendDigit(n), children: n }, n))), _jsx("button", { type: "button", onClick: () => handleOperator("*"), "aria-label": "Multiply", children: "\u00D7" }), ["4", "5", "6"].map((n) => (_jsx("button", { type: "button", onClick: () => appendDigit(n), children: n }, n))), _jsx("button", { type: "button", onClick: () => handleOperator("-"), "aria-label": "Subtract", children: "\u2212" }), ["1", "2", "3"].map((n) => (_jsx("button", { type: "button", onClick: () => appendDigit(n), children: n }, n))), _jsx("button", { type: "button", onClick: () => handleOperator("+"), "aria-label": "Add", children: "+" }), _jsx("button", { className: "calculator__zero", type: "button", onClick: () => appendDigit("0"), children: "0" }), _jsx("button", { type: "button", onClick: appendDecimal, children: "." }), _jsx("button", { className: "calculator__equals", type: "button", onClick: handleEquals, "aria-label": "Equals", children: "=" })] })] }));
}
export const CalculatorApp = {
    id: "calculator",
    name: "Calculator",
    description: "Perform quick arithmetic calculations.",
    icon: "🧮",
    component: Calculator
};
