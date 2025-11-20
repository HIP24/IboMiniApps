import { useState } from "react";
import type { MiniAppDefinition } from "../types";

const transliterationScheme: Record<string, string> = {
  'ا': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j', 'ح': 'h', 'خ': 'kh',
  'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's',
  'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y'
};

function ArabicToLatin() {
  const [arabicText, setArabicText] = useState("");
  const [latinText, setLatinText] = useState("");

  const transliterate = (text: string) => {
    return text
      .split('\n')
      .map(line => 
        line
          .split('')
          .map(char => transliterationScheme[char] || char)
          .join('')
      )
      .join('\n');
  };

  const handleTransliterate = () => {
    setLatinText(transliterate(arabicText));
  };

  const handleClear = () => {
    setArabicText("");
    setLatinText("");
  };

  return (
    <div className="arabic-to-latin">
      <div className="arabic-to-latin__grid">
        <fieldset className="arabic-to-latin__input-section">
          <legend>Arabic Text</legend>
          <textarea
            id="arabic-input"
            value={arabicText}
            onChange={(e) => setArabicText(e.target.value)}
            placeholder="أدخل النص العربي هنا..."
            rows={10}
            dir="rtl"
            className="arabic-to-latin__textarea"
          />
        </fieldset>

        <div className="arabic-to-latin__controls">
          <button 
            type="button" 
            onClick={handleTransliterate}
            className="arabic-to-latin__button arabic-to-latin__button--primary"
          >
            🔤 Transliterate
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="arabic-to-latin__button arabic-to-latin__button--secondary"
          >
            🗑️ Clear
          </button>
        </div>

        <fieldset className="arabic-to-latin__output-section">
          <legend>Latin Text</legend>
          <textarea
            id="latin-output"
            value={latinText}
            readOnly
            placeholder="Transliterated text will appear here..."
            rows={10}
            className="arabic-to-latin__textarea arabic-to-latin__textarea--readonly"
          />
        </fieldset>
      </div>
    </div>
  );
}

export const ArabicToLatinApp: MiniAppDefinition = {
  id: "arabic-to-latin",
  name: "Arabic To Latin Converter",
  description: "Convert Arabic text to Latin script transliteration.",
  icon: "🔤",
  component: ArabicToLatin
};

// Add CSS styles
const styles = `
.arabic-to-latin {
  display: grid;
  gap: 24px;
  max-width: 800px;
  margin: 0 auto;
}

.arabic-to-latin__grid {
  display: grid;
  gap: 20px;
}

.arabic-to-latin__input-section,
.arabic-to-latin__output-section {
  background: rgba(249, 250, 251, 0.8);
}

.arabic-to-latin__textarea {
  width: 100%;
  min-height: 200px;
  resize: vertical;
  font-size: 1.1rem;
  line-height: 1.6;
  border-radius: 12px;
  border: 2px solid rgba(107, 114, 128, 0.2);
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  transition: border-color 200ms ease, box-shadow 200ms ease;
  scrollbar-width: thin;
  scrollbar-color: rgba(59, 130, 246, 0.3) rgba(243, 244, 246, 0.5);
}

.arabic-to-latin__textarea::-webkit-scrollbar {
  width: 8px;
}

.arabic-to-latin__textarea::-webkit-scrollbar-track {
  background: rgba(243, 244, 246, 0.5);
  border-radius: 4px;
}

.arabic-to-latin__textarea::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 4px;
  transition: background 200ms ease;
}

.arabic-to-latin__textarea::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

.arabic-to-latin__textarea:focus {
  outline: none;
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.arabic-to-latin__textarea--readonly {
  background: rgba(243, 244, 246, 0.8);
  color: #374151;
}

.arabic-to-latin__textarea--readonly::-webkit-scrollbar-thumb {
  background: rgba(107, 114, 128, 0.3);
}

.arabic-to-latin__textarea--readonly::-webkit-scrollbar-thumb:hover {
  background: rgba(107, 114, 128, 0.5);
}

.arabic-to-latin__controls {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.arabic-to-latin__button {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 200ms ease;
  min-width: 140px;
  font-size: 1rem;
}

.arabic-to-latin__button--primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.arabic-to-latin__button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.arabic-to-latin__button--secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #374151;
  border: 2px solid rgba(107, 114, 128, 0.2);
}

.arabic-to-latin__button--secondary:hover {
  background: rgba(107, 114, 128, 0.2);
  transform: translateY(-1px);
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}