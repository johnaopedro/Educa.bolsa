import React from 'react';
import { Sun, Moon, PiggyBank } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-gray-100 dark:border-slate-800 shadow-sm transition-all duration-300">
      <div className="max-w-4xl mx-auto flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-brand-400 to-brand-600 rounded-[1rem] flex items-center justify-center text-white shadow-md animate-float">
            <PiggyBank size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-600 dark:text-brand-100">Educa.bolsa</h1>
        </div>
        
        <button 
          onClick={toggleTheme}
          className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Alternar modo claro e escuro"
        >
          {theme === 'light' ? (
            <Moon size={32} className="text-brand-600" />
          ) : (
            <Sun size={32} className="text-brand-100" />
          )}
        </button>
      </div>
    </header>
  );
};
