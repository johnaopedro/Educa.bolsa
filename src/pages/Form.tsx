import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { CurrencyInput } from '../components/CurrencyInput';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { useLocalStorage } from '../utils/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export interface SimulationData {
  id: string;
  income: string;
  essentialExpenses: string;
  debts: string;
  extraExpenses: string;
  savedMoney: string;
  goal: string;
  goalCost: string;
  date: string;
}

export const Form: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  const [income, setIncome] = useState('');
  const [essentialExpenses, setEssentialExpenses] = useState('');
  const [debts, setDebts] = useState('');
  const [extraExpenses, setExtraExpenses] = useState('');
  const [savedMoney, setSavedMoney] = useState('');
  const [goal, setGoal] = useState('');
  const [goalCost, setGoalCost] = useState('');

  const [simulations, setSimulations] = useLocalStorage<SimulationData[]>('@meubolsofeliz:simulations', []);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      const newSimulation: SimulationData = {
        id: uuidv4(),
        income,
        essentialExpenses,
        debts,
        extraExpenses,
        savedMoney,
        goal,
        goalCost,
        date: new Date().toISOString()
      };
      
      setSimulations([...simulations, newSimulation]);
      navigate(`/resultado/${newSimulation.id}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      navigate('/');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <QuestionCard>
            <CurrencyInput 
              label="1. Quanto você recebe de aposentadoria ou pensão por mês?"
              value={income}
              onChange={setIncome}
              helperText="Pode ser o valor aproximado que cai na conta."
            />
          </QuestionCard>
        );
      case 2:
        return (
          <QuestionCard>
            <CurrencyInput 
              label="2. Quanto você gasta com contas essenciais?"
              value={essentialExpenses}
              onChange={setEssentialExpenses}
              helperText="Luz, água, aluguel e remédios de uso contínuo."
            />
          </QuestionCard>
        );
      case 3:
        return (
          <QuestionCard>
            <CurrencyInput 
              label="3. Você paga parcelas de empréstimo ou cartão?"
              value={debts}
              onChange={setDebts}
              helperText="Se não tiver dívidas, pode deixar em R$ 0,00."
            />
          </QuestionCard>
        );
      case 4:
        return (
          <QuestionCard>
            <CurrencyInput 
              label="4. Quanto você costuma gastar com extras?"
              value={extraExpenses}
              onChange={setExtraExpenses}
              helperText="Mercado extra, padaria, presentes pros netos, lazer."
            />
          </QuestionCard>
        );
      case 5:
        return (
          <QuestionCard>
            <CurrencyInput 
              label="5. Você já tem algum dinheiro guardado?"
              value={savedMoney}
              onChange={setSavedMoney}
              helperText="Dinheiro na poupança, conta ou guardado em casa."
            />
          </QuestionCard>
        );
      case 6:
        return (
          <QuestionCard>
            <div className="flex flex-col gap-2 w-full">
              <label className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                6. Qual é o seu próximo grande sonho?
              </label>
              <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: Viajar para a praia"
                className="input-premium"
              />
            </div>
          </QuestionCard>
        );
      case 7:
        return (
          <QuestionCard>
            <CurrencyInput 
              label={`7. Quanto custa "${goal || 'o seu sonho'}"?`}
              value={goalCost}
              onChange={setGoalCost}
            />
          </QuestionCard>
        );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
    if (currentStep === 1 && !income) return true;
    if (currentStep === 2 && !essentialExpenses) return true;
    if (currentStep === 3 && !debts && debts !== '') return true; // Allows empty initially but validates if user touches it
    if (currentStep === 4 && !extraExpenses) return true;
    if (currentStep === 5 && !savedMoney && savedMoney !== '') return true;
    if (currentStep === 6 && !goal) return true;
    if (currentStep === 7 && !goalCost) return true;
    return false;
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
      
      {renderStep()}

      <div className="flex flex-col md:flex-row gap-4 mt-12">
        <Button variant="secondary" onClick={handleBack} icon={<ArrowLeft size={28} />}>
          Voltar
        </Button>
        <Button 
          variant="primary" 
          onClick={handleNext} 
          disabled={isNextDisabled()}
          icon={currentStep === totalSteps ? <CheckCircle2 size={28} /> : <ArrowRight size={28} />}
        >
          {currentStep === totalSteps ? 'Ver Resultado' : 'Próxima Pergunta'}
        </Button>
      </div>
    </div>
  );
};
