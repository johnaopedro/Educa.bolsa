import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../utils/useLocalStorage';
import type { SimulationData } from './Form';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { Button } from '../components/Button';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const [simulations] = useLocalStorage<SimulationData[]>('@meubolsofeliz:simulations', []);

  // Show newest first
  const reversedSimulations = [...simulations].reverse();

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-gray-700 dark:text-gray-300" aria-label="Voltar">
          <ArrowLeft size={32} />
        </button>
        <h1 className="text-4xl font-extrabold text-brand-600 dark:text-brand-400 flex items-center gap-3">
          <Clock size={36} /> Histórico de Simulações
        </h1>
      </div>

      <p className="text-xl text-gray-600 dark:text-gray-400 font-medium">
        Aqui estão todas as simulações que você já fez. Clique em uma para ver o resultado detalhado ou conversar com o Educador Financeiro.
      </p>

      {reversedSimulations.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl shadow-premium-soft border border-gray-100 dark:border-slate-800">
          <Search size={64} className="mx-auto text-gray-300 dark:text-slate-700 mb-6" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-4">Você ainda não possui simulações.</h2>
          <Button onClick={() => navigate('/simulacao')}>Fazer a primeira Simulação</Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {reversedSimulations.map((sim, index) => (
            <div 
              key={sim.id} 
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm hover:shadow-premium-hover hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-slate-800 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              onClick={() => navigate(`/resultado/${sim.id}`)}
              role="button"
              tabIndex={0}
            >
              <div>
                <p className="text-sm text-gray-400 mb-1 font-bold tracking-wider">SIMULAÇÃO {simulations.length - index}</p>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  Sonho: <span className="text-brand-600 dark:text-brand-400">{sim.goal}</span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                  Renda Informada: {sim.income}
                </p>
              </div>
              
              <div className="w-full sm:w-auto">
                <Button variant="secondary" onClick={(e) => {
                  e.stopPropagation(); // Previne abrir o resultado duplo
                  navigate(`/resultado/${sim.id}`);
                }}>
                  Ver Diagnóstico
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
