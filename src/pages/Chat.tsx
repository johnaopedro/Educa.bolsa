import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { startFinancialChat, fallbackChatResponse } from '../services/chatService';
import { useLocalStorage } from '../utils/useLocalStorage';
import type { SimulationData } from './Form';
import { ArrowLeft, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export const Chat: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [simulations] = useLocalStorage<SimulationData[]>('@meubolsofeliz:simulations', []);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', role: 'model', text: 'Olá! Eu sou o Companheiro de Bolso. Como posso te ajudar com o seu dinheirinho hoje?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // We use ReturnType to infer the correct type from the chatService
  const chatSessionRef = useRef<ReturnType<typeof startFinancialChat> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let contextStr = '';
    if (id) {
      const sim = simulations.find(s => s.id === id);
      if (sim) {
        contextStr = `Renda: ${sim.income}, Essencial: ${sim.essentialExpenses}, Dívidas: ${sim.debts}, Extras: ${sim.extraExpenses}, Guardado: ${sim.savedMoney}, Sonho: ${sim.goal} custando ${sim.goalCost}`;
        
        // Update the initial message to acknowledge the simulation
        setMessages([
          { id: 'initial', role: 'model', text: `Olá! Vi que você fez uma simulação sobre o seu sonho de "${sim.goal}". O que gostaria de perguntar sobre o resultado?` }
        ]);
      }
    }
    chatSessionRef.current = startFinancialChat(contextStr);
  }, [id, simulations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();
    setInputValue('');
    
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText }]);
    setIsLoading(true);

    try {
      let modelText = '';
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage(userText);
        modelText = result.response.text();
      } else {
        modelText = await fallbackChatResponse(userText);
      }

      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: modelText }]);
    } catch (error: unknown) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'model', 
        text: `Me desculpe, deu um erro técnico: ${errorMessage}` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium-soft overflow-hidden animate-[fadeIn_0.5s_ease-out] border border-gray-100 dark:border-slate-800">
      
      {/* Header do Chat */}
      <div className="bg-brand-500 text-white p-4 flex items-center gap-4 shadow-md z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-brand-600 rounded-full transition-colors" aria-label="Voltar">
          <ArrowLeft size={28} />
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Companheiro de Bolso</h2>
            <p className="text-sm opacity-90">Sempre online para ajudar</p>
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50 dark:bg-slate-900/50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-full shadow-sm ${msg.role === 'user' ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-300' : 'bg-brand-500 text-white'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`p-4 rounded-3xl text-lg shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-brand-500 text-white rounded-tr-sm' 
                  : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-sm border border-gray-100 dark:border-slate-700'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%] md:max-w-[75%]">
              <div className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full shadow-sm bg-brand-500 text-white">
                <Bot size={20} />
              </div>
              <div className="p-4 rounded-3xl rounded-tl-sm bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 text-xl p-4 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:border-brand-500 transition-colors"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-brand-500 hover:bg-brand-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-4 rounded-full shadow-btn-shadow transition-all flex items-center justify-center"
            aria-label="Enviar mensagem"
          >
            <Send size={28} />
          </button>
        </div>
      </form>
    </div>
  );
};
