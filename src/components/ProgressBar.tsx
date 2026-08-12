import React from 'react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  const percentage = Math.round((currentStep / totalSteps) * 100);

  // Cores de Semáforo nas Barras como sugerido
  let colorClass = 'bg-success'; // Verde
  if (percentage < 33) {
    colorClass = 'bg-danger'; // Vermelho
  } else if (percentage < 66) {
    colorClass = 'bg-warning'; // Amarelo
  }

  return (
    <div className="w-full mb-8">
      <div className="flex justify-between text-xl font-bold mb-3">
        <span>Etapa {currentStep} de {totalSteps}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClass} transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
