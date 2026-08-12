import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { useLocalStorage } from '../utils/useLocalStorage';
import type { SimulationData } from './Form';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [simulations] = useLocalStorage<SimulationData[]>('@meubolsofeliz:simulations', []);

  const handleChatClick = () => {
    if (simulations.length > 0) {
      const latestId = simulations[simulations.length - 1].id;
      navigate(`/chat/${latestId}`);
    } else {
      navigate('/chat');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12 animate-[fadeIn_1s_ease-out]">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-brand-600 dark:text-brand-100 leading-tight">
          Bem-vindo ao <br className="md:hidden" />Educa.bolsa
        </h1>
        <p className="text-2xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-medium">
          Seu companheiro inteligente para cuidar do seu dinheiro com tranquilidade, sem letras miúdas.
        </p>
      </div>

      <div className="w-full max-w-md space-y-6">
        <Button 
          onClick={() => navigate('/simulacao')} 
          icon={<ArrowRight size={32} />}
        >
          Começar Agora
        </Button>
      </div>

      <div className="fixed bottom-8 right-8">
        <button 
          className="bg-gradient-to-tr from-brand-500 to-brand-600 text-white p-6 rounded-full shadow-btn-shadow hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-300 flex items-center justify-center animate-pulse-soft"
          aria-label="Falar com o Companheiro de Bolso"
          title="Chat com a IA"
          onClick={handleChatClick}
        >
          <MessageCircle size={36} />
        </button>
      </div>
    </div>
  );
};
