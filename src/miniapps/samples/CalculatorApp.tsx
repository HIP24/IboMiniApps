import { useState } from "react";
import type { MiniAppDefinition } from "../types";

const operators = ["+", "-", "*", "/"] as const;
type Operator = (typeof operators)[number];

type PendingOperation = {
  left: number;
  operator: Operator;
};

function Calculator() {
  const [display, setDisplay] = useState("0");
  const [pending, setPending] = useState<PendingOperation | null>(null);
  const [shouldReset, setShouldReset] = useState(false);

  const appendDigit = (digit: string) => {
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

  const performPending = (nextOperator?: Operator) => {
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
    } else {
      setPending(null);
    }
  };

  const handleOperator = (operator: Operator) => {
    if (shouldReset) {
      setPending((prev) =>
        prev
          ? {
              left: prev.left,
              operator
            }
          : {
              left: parseFloat(display),
              operator
            }
      );
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

  return (
    <div className="calculator">
      <div className="calculator__display" role="status">
        {display}
      </div>

      <div className="calculator__grid" role="group" aria-label="Calculator keypad">
        <button type="button" onClick={clearAll}>
          C
        </button>
        <button type="button" onClick={toggleSign}>
          ±
        </button>
        <button type="button" onClick={percent}>
          %
        </button>
        <button type="button" onClick={() => handleOperator("/")}
          aria-label="Divide"
        >
          ÷
        </button>

        {["7", "8", "9"].map((n) => (
          <button key={n} type="button" onClick={() => appendDigit(n)}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => handleOperator("*")}
          aria-label="Multiply"
        >
          ×
        </button>

        {["4", "5", "6"].map((n) => (
          <button key={n} type="button" onClick={() => appendDigit(n)}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => handleOperator("-")}
          aria-label="Subtract"
        >
          −
        </button>

        {["1", "2", "3"].map((n) => (
          <button key={n} type="button" onClick={() => appendDigit(n)}>
            {n}
          </button>
        ))}
        <button type="button" onClick={() => handleOperator("+")}
          aria-label="Add"
        >
          +
        </button>

        <button className="calculator__zero" type="button" onClick={() => appendDigit("0")}>
          0
        </button>
        <button type="button" onClick={appendDecimal}>
          .
        </button>
        <button className="calculator__equals" type="button" onClick={handleEquals}
          aria-label="Equals"
        >
          =
        </button>
      </div>
    </div>
  );
}

export const CalculatorApp: MiniAppDefinition = {
  id: "calculator",
  name: "Calculator",
  description: "Perform quick arithmetic calculations.",
  icon: "🧮",
  component: Calculator
};
