import React from 'react';

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({ label, value, onChange, helperText, ...props }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    
    // Remove tudo que não for número
    inputValue = inputValue.replace(/\D/g, "");
    
    // Converte para valor financeiro com 2 casas decimais
    const numericValue = Number(inputValue) / 100;
    
    // Se não for um número válido após apagar tudo, reseta
    if (isNaN(numericValue) || inputValue === '') {
      onChange("");
      return;
    }

    // Formata para pt-BR
    const formatted = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numericValue);

    onChange(formatted);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {label}
      </label>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        placeholder="R$ 0,00"
        className="input-premium"
        {...props}
      />
      {helperText && (
        <span className="text-xl text-gray-600 dark:text-gray-400 mt-2 flex items-center justify-center text-center">
          {helperText}
        </span>
      )}
    </div>
  );
};
