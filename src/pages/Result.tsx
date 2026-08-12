import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { useLocalStorage } from '../utils/useLocalStorage';
import type { SimulationData } from './Form';
import { generateFinancialInsights, type AiInsights } from '../services/geminiService';
import { ArrowLeft, RefreshCw, BrainCircuit, Activity, AlertTriangle } from 'lucide-react';

export const Result: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [simulations] = useLocalStorage<SimulationData[]>('@meubolsofeliz:simulations', []);
  const [insightsCache, setInsightsCache] = useLocalStorage<Record<string, AiInsights>>('@meubolsofeliz:insights', {});
  
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<AiInsights | null>(null);
  
  const simulation = simulations.find(s => s.id === id);

  useEffect(() => {
    if (!simulation) return;

    const fetchInsights = async () => {
      if (insightsCache[simulation.id]) {
        setInsights(insightsCache[simulation.id]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await generateFinancialInsights(
        simulation.income,
        simulation.essentialExpenses,
        simulation.debts,
        simulation.extraExpenses,
        simulation.savedMoney,
        simulation.goal,
        simulation.goalCost
      );
      
      setInsights(data);
      setInsightsCache(prev => ({ ...prev, [simulation.id]: data }));
      setLoading(false);
    };

    fetchInsights();
  }, [simulation, insightsCache, setInsightsCache]);

  if (!simulation) {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-bold text-danger mb-4">Simulação não encontrada!</h2>
        <Button onClick={() => navigate('/')}>Voltar para o Início</Button>
      </div>
    );
  }

  // Cálculos para o gráfico de barras
  const parseCurrency = (val: string) => Number(val.replace(/\D/g, '')) / 100 || 0;
  const inc = parseCurrency(simulation.income);
  const ess = parseCurrency(simulation.essentialExpenses);
  const db = parseCurrency(simulation.debts);
  const ext = parseCurrency(simulation.extraExpenses);
  
  const totalExp = ess + db + ext;
  const leftover = Math.max(0, inc - totalExp);
  const baseForPerc = Math.max(inc, totalExp); // Usa o maior para a barra chegar a 100%
  
  const pEss = (ess / baseForPerc) * 100;
  const pDb = (db / baseForPerc) * 100;
  const pExt = (ext / baseForPerc) * 100;
  const pLeft = (leftover / baseForPerc) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Resumo e Gráfico */}
      <div className="card-premium">
        <h2 className="text-3xl font-bold text-brand-900 dark:text-brand-100 mb-2 text-center">
          Para onde vai o seu dinheiro?
        </h2>
        <p className="text-xl text-center text-gray-600 dark:text-gray-400 mb-8">
          Sua Renda: <span className="font-bold text-brand-600 dark:text-brand-400">{simulation.income}</span>
        </p>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-lg font-bold text-gray-700 dark:text-gray-300">
              <span>Essencial (Luz, Aluguel)</span>
              <span>{simulation.essentialExpenses}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-6 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 transition-all duration-700" style={{ width: `${pEss}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-lg font-bold text-gray-700 dark:text-gray-300">
              <span>Dívidas (Empréstimos/Cartão)</span>
              <span>{simulation.debts || 'R$ 0,00'}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-6 rounded-full overflow-hidden">
              <div className="h-full bg-danger transition-all duration-700" style={{ width: `${pDb}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-lg font-bold text-gray-700 dark:text-gray-300">
              <span>Extras (Mercado extra, presentes)</span>
              <span>{simulation.extraExpenses}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-6 rounded-full overflow-hidden">
              <div className="h-full bg-warning transition-all duration-700" style={{ width: `${pExt}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-8 pt-6 border-t-2 border-gray-100 dark:border-slate-700">
            <div className="flex justify-between text-xl font-bold text-brand-600 dark:text-brand-400">
              <span>Sobra para o Sonho</span>
              <span>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(leftover)}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-6 rounded-full overflow-hidden">
              <div className="h-full bg-success transition-all duration-700" style={{ width: `${pLeft}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-premium">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-brand-500 text-white p-3 rounded-full">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl font-bold text-brand-900 dark:text-white">
            O Companheiro de Bolso diz:
          </h2>
        </div>

        {loading && (
          <div className="flex flex-col items-center py-10 space-y-4">
            <RefreshCw size={48} className="text-brand-500 animate-spin" />
            <p className="text-2xl font-semibold text-gray-600 dark:text-gray-300">
              Lendo suas anotações com carinho para dar as melhores dicas...
            </p>
          </div>
        )}

        {!loading && !insights && (
          <p className="text-xl text-danger">Não foi possível carregar as dicas no momento.</p>
        )}

        {!loading && insights && (
          <div className="space-y-8 animate-[fadeIn_1s_ease-out]">
            
            <div className="flex items-center gap-6 bg-brand-50 dark:bg-slate-800 p-6 rounded-2xl border-2 border-brand-100 dark:border-slate-700">
              <div className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-900 rounded-full w-24 h-24 shadow-sm border-4 border-brand-500">
                <span className="text-3xl font-bold text-brand-600 dark:text-brand-400">{insights.healthScore}</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1 flex items-center gap-2">
                  <Activity size={24} className="text-brand-500" /> Nota de Saúde
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400">De 0 a 100, esta é a nota da sua organização financeira.</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border-l-8 border-brand-500 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">O Diagnóstico</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">{insights.diagnosis}</p>
            </div>

            {insights.debtWarning && (
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border-l-8 border-danger shadow-sm">
                <h3 className="text-2xl font-bold text-danger mb-3 flex items-center gap-2">
                  <AlertTriangle size={24} /> Atenção com as Dívidas
                </h3>
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">{insights.debtWarning}</p>
              </div>
            )}

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border-l-8 border-success shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">O Pote dos Sonhos ({simulation.goal})</h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">{insights.savingsPlan}</p>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800 p-6 rounded-2xl border-l-8 border-warning shadow-sm">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Dicas Práticas</h3>
              <ul className="space-y-4">
                {insights.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-3 items-start text-xl text-gray-700 dark:text-gray-300">
                    <span className="text-brand-500 font-bold">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Button variant="primary" onClick={() => navigate(`/chat/${id}`)} icon={<BrainCircuit size={28} />}>
          Dúvidas? Fale com a IA
        </Button>
        <Button variant="secondary" onClick={() => navigate('/simulacao')} icon={<ArrowLeft size={28} />}>
          Refazer
        </Button>
      </div>
    </div>
  );
};
