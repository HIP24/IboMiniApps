import { useState, useEffect, useRef } from "react";
import type { MiniAppDefinition } from "../types";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'main' | 'translation';
  translationMode?: 'toEnglish' | 'toSyrian';
}

function SyrianAI() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'What did they say, Habibi?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [translationMode, setTranslationMode] = useState<'toEnglish' | 'toSyrian'>('toEnglish');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callOpenRouter = async (systemPrompt: string, userMessage: string): Promise<string> => {
    try {
      const url = '/translate';
      console.log('Fetching from:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemPrompt,
          userMessage
        })
      });

      if (!response.ok) {
        console.error('Response not ok:', response.status, response.statusText);
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Sorry, could not process your request.';
    } catch (error) {
      console.error('Error calling OpenRouter:', error);
      return "Sorry, couldn't connect to server. Please try again.";
    }
  };

  const processMessage = async (userMessage: string): Promise<string> => {
    if (translationMode === 'toEnglish') {
      // Prompt 1: Arabic to English
      const systemPrompt = 'You are a precise Arabic-English translator. Translate the Arabic text to English accurately. Do not invent or add words that are not in the original text. Format: **Translation**\n[accurate English translation]\n\n**Word Breakdown**\n[Arabic word] = [English meaning]\n[Arabic word] = [English meaning]\n\nOnly translate what is actually written. Do not add extra words or interpretations.';
      return callOpenRouter(systemPrompt, userMessage);
    } else {
      // Prompt 2: Any language to Syrian Arabic
      const systemPrompt = 'You are a precise translator to Syrian Arabic dialect. Translate accurately without adding extra words or interpretations. Format: **Syrian Translation**\n[accurate Syrian Arabic translation]\n\n**Word Breakdown**\n[original word] = [Syrian Arabic word]\n[original word] = [Syrian Arabic word]\n\nOnly translate the actual words provided. Do not invent or add content.';
      return callOpenRouter(systemPrompt, userMessage);
    }
  };

  const renderMessageWithCopyButtons = (text: string, message: Message) => {
    const lines = text.split('\n');
    return lines.map((line, index) => {
      if (line.includes('[COPY]')) {
        const cleanLine = line.replace(' [COPY]', '');
        const arabicMatch = cleanLine.match(/^([^(]+)/);
        const arabicText = arabicMatch ? arabicMatch[1].trim() : cleanLine;
        
        return (
          <div key={index} className="syrian-ai__reply-option">
            <span>{cleanLine}</span>
            <button 
              onClick={() => copyToClipboard(arabicText)}
              className="syrian-ai__copy-small"
            >
              📋
            </button>
          </div>
        );
      }
      
      // Handle markdown bold formatting **text**
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/);
        const isWordBreakdown = line.includes('Word Breakdown');
        return (
          <div key={index} style={isWordBreakdown ? {marginTop: '20px'} : {}}>
            {parts.map((part, partIndex) => 
              partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
            )}
          </div>
        );
      }
      
      // Add copy button next to Syrian translation
      if (message.translationMode === 'toSyrian' && index > 0 && lines[index - 1].includes('**Syrian Translation**') && line.trim()) {
        return (
          <div key={index} style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px'}}>
            <span>{line}</span>
            <button 
              onClick={() => copyToClipboard(line.trim())}
              className="syrian-ai__copy-small syrian-ai__copy-small--green"
            >
              📋
            </button>
          </div>
        );
      }
      
      return <div key={index}>{line}</div>;
    });
  };



  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
      timestamp: new Date(),
      type: translationMode === 'toEnglish' ? 'main' : 'translation'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await processMessage(input);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        type: translationMode === 'toEnglish' ? 'main' : 'translation',
        translationMode: translationMode
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "معذرة، صار خطأ تقني. جرب مرة تانية.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: '1',
      text: 'How can I help you, Habibi?',
      isUser: false,
      timestamp: new Date()
    }]);
  };

  return (
    <div className="syrian-ai">
      <div className="syrian-ai__header">
        <h3 className="syrian-ai__title">Chat</h3>
        <button onClick={clearChat} className="syrian-ai__header-clear">
          🗑️
        </button>
      </div>
      <div className="syrian-ai__chat">
        <div className="syrian-ai__messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`syrian-ai__message ${message.isUser ? 'syrian-ai__message--user' : 'syrian-ai__message--ai'} ${message.type === 'translation' ? 'syrian-ai__message--translation' : 'syrian-ai__message--main'}`}
            >
              {!message.isUser && (
                <div className="syrian-ai__avatar">
                  🤖
                </div>
              )}
              <div className="syrian-ai__message-content">
                {!message.isUser ? (
                  <div>{renderMessageWithCopyButtons(message.text, message)}</div>
                ) : (
                  <div>{message.text}</div>
                )}
                {!message.isUser && message.text.includes('[COPY]') && (
                  <button 
                    onClick={() => {
                      const arabicOnly = message.text
                        .split('\n')
                        .filter(line => line.includes('[COPY]'))
                        .map(line => {
                          const cleanLine = line.replace(' [COPY]', '');
                          const arabicMatch = cleanLine.match(/^([^(]+)/);
                          return arabicMatch ? arabicMatch[1].trim() : cleanLine;
                        })
                        .join('\n');
                      copyToClipboard(arabicOnly);
                    }}
                    className="syrian-ai__copy-btn"
                  >
                    📋 Copy Translation
                  </button>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="syrian-ai__message syrian-ai__message--ai">
              <div className="syrian-ai__avatar">
                🤖
              </div>
              <div className="syrian-ai__message-content syrian-ai__typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="syrian-ai__input-area">
        <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
          <button 
            onClick={() => setTranslationMode('toEnglish')}
            style={{
              padding: '8px 16px',
              border: '2px solid #007acc',
              borderRadius: '6px',
              backgroundColor: translationMode === 'toEnglish' ? '#007acc' : 'transparent',
              color: translationMode === 'toEnglish' ? 'white' : '#007acc',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Translate to English
          </button>
          <button 
            onClick={() => setTranslationMode('toSyrian')}
            style={{
              padding: '8px 16px',
              border: '2px solid #28a745',
              borderRadius: '6px',
              backgroundColor: translationMode === 'toSyrian' ? '#28a745' : 'transparent',
              color: translationMode === 'toSyrian' ? 'white' : '#28a745',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Translate to Syrian
          </button>
        </div>
        <div className="syrian-ai__input-group" style={{display: 'flex', gap: '8px'}}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
            placeholder={translationMode === 'toEnglish' ? 'Enter Arabic text...' : 'Enter text to translate to Syrian...'}
            rows={2}
            className="syrian-ai__textarea"
            style={{flex: 1}}
          />
          <button 
            onClick={sendMessage} 
            disabled={isLoading || !input.trim()}
            className="syrian-ai__send-btn"
          >
            {isLoading ? '⏳' : '🔄 Translate'}
          </button>
        </div>
      </div>
    </div>
  );
}

const syrianAIDefinition: MiniAppDefinition = {
  id: "syrian-ai",
  name: "Syrian Habibi",
  description: "AI assistant for Syrian translation",
  icon: "🤖",
  component: SyrianAI
};

export default syrianAIDefinition;