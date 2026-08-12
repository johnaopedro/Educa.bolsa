import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, Wallet, Clock } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const Layout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text font-sans transition-colors duration-300`}>
      <header className="bg-white dark:bg-dark-surface shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-brand-600 dark:text-brand-400 hover:opacity-80 transition-opacity">
            <div className="bg-brand-500 text-white p-2 rounded-xl">
              <Wallet size={32} />
            </div>
            <span className="text-2xl font-black tracking-tight">Educa.bolsa</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <Link 
              to="/historico" 
              className="p-3 rounded-full hover:bg-brand-50 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              aria-label="Ver histórico de simulações"
              title="Histórico de Simulações"
            >
              <Clock size={28} />
            </Link>
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full hover:bg-brand-50 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 transition-colors"
              aria-label="Alternar tema"
              title="Alternar modo claro/escuro"
            >
              {theme === 'light' ? <Moon size={28} /> : <Sun size={28} />}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-8 pt-24 md:pt-32">
        <Outlet />
      </main>
    </div>
  );
};
