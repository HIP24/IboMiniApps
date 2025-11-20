import { useState } from "react";
import type { MiniAppDefinition } from "../types";

const transliterationScheme: Record<string, string> = {
  // core arabic letters
  'ا': 'a', 'أ': 'a', 'إ': 'i', 'آ': 'ā',
  'ب': 'b', 'ت': 't', 'ث': 'ṯ', 'ج': 'ǧ', 'ح': 'ḥ', 'خ': 'ḫ',
  'د': 'd', 'ذ': 'ḏ', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'š',
  'ص': 'ṣ', 'ض': 'ḍ', 'ط': 'ṭ', 'ظ': 'ẓ', 'ع': 'ʿ', 'غ': 'ġ',
  'ف': 'f', 'ق': 'q', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
  'ه': 'h', 'ة': 'ṯ', 'و': 'w', 'ي': 'y', 'ى': 'á',

  // hamza and variants
  'ء': 'ʾ', 'ؤ': 'ʾw', 'ئ': 'ʾy',

  // diacritics
  'َ': 'a', 'ِ': 'i', 'ُ': 'u', 'ً': 'an', 'ٍ': 'in', 'ٌ': 'un',
  'ّ': '', 'ْ': '', 'ـ': '',

  // arabic numerals
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',

  // punctuation
  '؟': '?', '؛': ';', '،': ',', '٪': '%',

  // additional phonetic characters
  'γ': 'γ', 'ɛ': 'ɛ', 'č': 'č', 'm̩': 'm̩', 'ɖ': 'ɖ',
  'ḥ': 'ḥ', 'r̩': 'r̩', 'ɓ': 'ɓ', 'ə̄': 'ə̄',
  'ē': 'ē', 'ī': 'ī', 'ō': 'ō', 'ū': 'ū'
};



function ArabicToLatin() {
  const [arabicText, setArabicText] = useState("");
  const [latinText, setLatinText] = useState("");

  const transliterate = (text: string) => {
    return text
      .split('\n')
      .map(line => {
        // Remove extra spaces and normalize
        let result = line.trim()
          .split('')
          .map(char => transliterationScheme[char] || char)
          .join('')
          // Clean up multiple spaces
          .replace(/\s+/g, ' ')
          // Handle common Arabic patterns for better readability
          .replace(/al([bcdfghjklmnpqrstvwxyz])/g, 'al-$1') // Add hyphen after "al"
          .replace(/([aeiou])\1+/g, '$1') // Remove repeated vowels
          // Make emphatic letters more readable
          .replace(/ss/g, 's') // Simplify emphatic s
          .replace(/dd/g, 'd') // Simplify emphatic d  
          .replace(/tt/g, 't') // Simplify emphatic t
          .replace(/zz/g, 'z') // Simplify emphatic z
          // Handle common endings
          .replace(/ah\b/g, 'a') // Simplify taa marbouta at word end
          .replace(/\bwa/g, 'wa ') // Add space after "wa" (and)
          // Clean up
          .replace(/\s+/g, ' ')
          .trim();
        
        return result;
      })
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
  description: "Convert Arabic text to Latin",
  icon: "🔤",
  component: ArabicToLatin
};

