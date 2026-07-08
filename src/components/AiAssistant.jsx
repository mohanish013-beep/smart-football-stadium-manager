import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User } from 'lucide-react';
import { processQuery } from '../services/aiService';

export default function AiAssistant() {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Hello! I am your stadium assistant. How can I help you navigate or translate today?' }]);
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
    if (!text.trim()) return;
    
    const userMessage = text;
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await processQuery(userMessage);
      setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListen = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Web Speech API is not supported in this browser.");
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

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="glass-panel flex flex-col h-[400px] w-full" aria-label="AI Assistant Chat">
      <div className="p-4 border-b border-white/10 flex items-center space-x-2">
        <Bot className="text-fifa-green" />
        <h2 className="font-semibold text-lg">AI Assistant</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4" aria-live="polite">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg p-3 ${msg.sender === 'user' ? 'bg-fifa-purple text-white' : 'bg-white/10 dark:bg-white/5'}`}>
              <div className="flex items-center space-x-2 mb-1">
                {msg.sender === 'user' ? <User size={14} className="opacity-70"/> : <Bot size={14} className="text-fifa-green"/>}
                <span className="text-xs opacity-70">{msg.sender === 'user' ? 'You' : 'AI'}</span>
              </div>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-lg p-3 text-sm animate-pulse">Typing...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 border-t border-white/10 flex items-center space-x-2">
        <button 
          onClick={toggleListen}
          className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-500 animate-pulse text-white' : 'glass-button'}`}
          aria-label={isListening ? "Stop listening" : "Start voice input"}
        >
          <Mic size={18} />
        </button>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask me anything..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-fifa-purple"
          aria-label="Chat input"
        />
        <button 
          onClick={() => handleSend(input)}
          className="p-2 rounded-lg bg-fifa-purple hover:bg-purple-700 text-white transition-colors"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
