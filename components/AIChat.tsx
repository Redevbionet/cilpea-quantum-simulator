import React, { useState, useEffect, useRef } from 'react';
import { SimulationResult, ChatMessage } from '../types';
import { analyzeSimulation } from '../services/gemini';
import { Sparkles, Send, Bot, User } from 'lucide-react';

interface AIChatProps {
  result: SimulationResult | null;
}

export const AIChat: React.FC<AIChatProps> = ({ result }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-trigger analysis when simulation finishes and isSecure changes or first run
  useEffect(() => {
    if (result && messages.length === 0) {
       handleSend("วิเคราะห์ผลการจำลองล่าสุดให้หน่อย");
    }
  }, [result]);

  const handleSend = async (text: string) => {
    if (!text.trim() && !result) return;
    
    const userMsg: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Call API
    const responseText = await analyzeSimulation(result!, text);

    const botMsg: ChatMessage = {
      role: 'model',
      content: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)] flex flex-col h-[600px] md:h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-900/50 flex items-center gap-2">
        <Sparkles className="text-purple-400" size={20} />
        <h3 className="font-bold text-white">CilPea AI Assistant</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 mt-10">
            <p>Run the simulation to start the AI analysis.</p>
            <p className="text-xs mt-2">Powered by Gemini 2.5</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center border border-purple-500/30 flex-shrink-0">
                <Bot size={16} className="text-purple-300" />
              </div>
            )}
            <div className={`max-w-[80%] p-3 rounded-xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-cyan-900/50 text-cyan-50 border border-cyan-700' 
                : 'bg-slate-700/50 text-slate-200 border border-slate-600'
            }`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
               <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
               <User size={16} className="text-cyan-300" />
             </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-purple-400 ml-12 animate-pulse">
            <Sparkles size={12} /> Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700 bg-slate-900/30">
        <div className="flex gap-2">
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="ถามเกี่ยวกับผลลัพธ์ หรือ โมเลกุล..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                disabled={loading || !result}
            />
            <button
                onClick={() => handleSend(input)}
                disabled={loading || !result || !input.trim()}
                className="bg-purple-600 hover:bg-purple-500 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
            >
                <Send size={18} />
            </button>
        </div>
      </div>
    </div>
  );
};
