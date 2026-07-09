import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, MicOff } from 'lucide-react';
import { processQuery } from '../services/aiService.js';

export default function AiAssistant({ compact = false }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Stadium AI online. Ask me about navigation, facilities, crowd routing, or emergency procedures.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: 'user', text: trimmed }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processQuery(trimmed);
      setMessages((prev) => [...prev, { sender: 'ai', text: response }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Connection error. Please check your API configuration.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Web Speech API is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSend(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const chatHeight = compact ? 'h-[220px]' : 'h-[320px]';

  return (
    <div
      className="flex flex-col w-full h-full"
      aria-label="AI Assistant Chat"
    >
      {/* Messages */}
      <div
        className={`${chatHeight} overflow-y-auto scrollbar-thin space-y-3 mb-3 pr-1`}
        aria-live="polite"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-cyan-accent" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-xl px-3 py-2.5 text-xs leading-relaxed
                ${msg.sender === 'user'
                  ? 'bg-cyan-accent/10 border border-cyan-accent/20 text-text-primary'
                  : 'bg-surface/60 border border-slate-border/20 text-text-secondary'
                }`}
            >
              {msg.text}
            </div>
            {msg.sender === 'user' && (
              <div className="w-6 h-6 rounded-lg bg-surface border border-slate-border/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User size={12} className="text-slate-muted" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-6 h-6 rounded-lg bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center flex-shrink-0">
              <Bot size={12} className="text-cyan-accent" />
            </div>
            <div className="bg-surface/60 border border-slate-border/20 rounded-xl px-4 py-2.5 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-accent/60 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Row */}
      <div className="flex items-center gap-2 border-t border-slate-border/20 pt-3">
        <button
          id="voice-input-toggle"
          onClick={toggleListen}
          className={`flex-shrink-0 p-2 rounded-lg transition-all duration-200 border
            ${isListening
              ? 'bg-red-500/15 border-red-500/30 text-red-400 animate-pulse'
              : 'glass-button text-slate-muted hover:text-cyan-accent'
            }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? <MicOff size={15} /> : <Mic size={15} />}
        </button>

        <input
          id="ai-chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask the stadium AI..."
          className="input-field py-2 text-xs"
          aria-label="Chat input"
        />

        <button
          id="ai-send-button"
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isLoading}
          className="flex-shrink-0 p-2 rounded-lg bg-cyan-accent/10 border border-cyan-accent/30 
            text-cyan-accent hover:bg-cyan-accent/20 hover:shadow-cyan-glow-sm 
            transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}
