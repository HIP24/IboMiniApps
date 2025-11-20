import { useState } from "react";
import type { MiniAppDefinition } from "../types";

const options = ["Yes", "No"];
const colors = ["#10b981", "#ef4444"];

function DecisionMaker() {
  const [result, setResult] = useState<string | null>(null);

  const makeDecision = () => {
    const randomIndex = Math.floor(Math.random() * options.length);
    setResult(options[randomIndex]);
  };

  return (
    <div className="decision-maker">
      <div className="decision-maker__content">
        <h2>Need help making a decision?</h2>
        <p>Click the button below for a Yes or No answer!</p>
        
        <button 
          onClick={makeDecision}
          className="decision-maker__button"
        >
          🎯 Make Decision
        </button>

        {result && (
          <div className="decision-maker__result">
            <h3 style={{ color: colors[options.indexOf(result)] }}>{result}!</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export const DecisionMakerApp: MiniAppDefinition = {
  id: "decision-maker",
  name: "Decision Maker",
  description: "Simple Yes or No decision maker",
  icon: "🎯",
  component: DecisionMaker
};

