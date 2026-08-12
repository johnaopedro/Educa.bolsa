import React from 'react';

interface QuestionCardProps {
  children: React.ReactNode;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ children }) => {
  return (
    <div className="card-premium w-full mt-4 animate-[fadeIn_0.5s_ease-out]">
      {children}
    </div>
  );
};
