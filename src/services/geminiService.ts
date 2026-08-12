import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface AiInsights {
  healthScore: number;
  diagnosis: string;
  debtWarning: string;
  recommendations: string[];
  savingsPlan: string;
}

export const generateFinancialInsights = async (
  income: string, 
  essentialExpenses: string,
  debts: string,
  extraExpenses: string,
  savedMoney: string,
  goal: string, 
  goalCost: string
): Promise<AiInsights> => {
  if (!API_KEY) {
    console.warn("Chave de API do Gemini não configurada. Usando dados de fallback.");
    return new Promise(resolve => setTimeout(() => resolve(getFallbackData(income, essentialExpenses, debts, extraExpenses, savedMoney, goal, goalCost)), 2000));
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      Você é um Educador Financeiro acolhedor e atencioso focado no público da terceira idade.
      Seu objetivo é ajudar idosos a controlarem sua aposentadoria sem estresse, usando palavras simples, claras e carinhosas.
      Não use jargões financeiros difíceis.
      
      Aqui estão os dados da pessoa:
      - Dinheiro que entrou (Renda): ${income}
      - Gastos essenciais (luz, remédios, etc): ${essentialExpenses}
      - Dívidas (empréstimos, cartão): ${debts || 'R$ 0,00'}
      - Gastos extras (mercado extra, presentes): ${extraExpenses}
      - Dinheiro que já tem guardado: ${savedMoney || 'R$ 0,00'}
      - O que quer comprar (Sonho): ${goal}
      - Quanto custa o sonho: ${goalCost}
      
      Analise essas informações e retorne APENAS um objeto JSON válido (sem blocos de código Markdown, apenas o JSON puro) com a seguinte estrutura exata:
      {
        "healthScore": 85, // Um número de 0 a 100 indicando a saúde financeira geral (ex: 100 se gasta pouco e guarda muito, 30 se tem muitas dívidas)
        "diagnosis": "Uma mensagem carinhosa dizendo como está a saúde financeira dela (se sobra, se as dívidas estão altas). Máximo 3 frases.",
        "debtWarning": "Aviso amigável focado APENAS em como reduzir o empréstimo/cartão. Deixe VAZIO se as dívidas forem zero ou muito baixas.",
        "recommendations": [
          "Dica simples e prática 1",
          "Dica simples e prática 2"
        ],
        "savingsPlan": "Uma mensagem amigável explicando como ela pode comprar o sonho, considerando o que ela já tem guardado e o quanto sobra no mês."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as AiInsights;

  } catch (error) {
    console.error("Erro ao gerar insights com Gemini:", error);
    return getFallbackData(income, essentialExpenses, debts, extraExpenses, savedMoney, goal, goalCost);
  }
};

const getFallbackData = (
  income: string, 
  essentialExpenses: string,
  debts: string,
  extraExpenses: string,
  savedMoney: string,
  goal: string, 
  goalCost: string
): AiInsights => {
  const valIncome = Number(income.replace(/\D/g, '')) / 100 || 0;
  const valEssential = Number(essentialExpenses.replace(/\D/g, '')) / 100 || 0;
  const valDebts = Number(debts.replace(/\D/g, '')) / 100 || 0;
  const valExtra = Number(extraExpenses.replace(/\D/g, '')) / 100 || 0;
  const valSaved = Number(savedMoney.replace(/\D/g, '')) / 100 || 0;
  const valGoalCost = Number(goalCost.replace(/\D/g, '')) / 100 || 0;

  const totalExpenses = valEssential + valDebts + valExtra;
  const balance = valIncome - totalExpenses;
  
  // Health Score calculation (simple logic for fallback)
  let healthScore = 100;
  if (totalExpenses > valIncome) healthScore = 20;
  else if (totalExpenses > valIncome * 0.8) healthScore = 50;
  else if (totalExpenses > valIncome * 0.5) healthScore = 80;
  
  if (valDebts > valIncome * 0.3) healthScore -= 20; 

  healthScore = Math.max(0, Math.min(100, healthScore));

  let diagnosis: string;
  if (balance > 0) {
    diagnosis = `Que maravilha! Você está cuidando muito bem da sua aposentadoria e está sobrando um pouquinho todo mês. Continue assim!`;
  } else {
    diagnosis = `Notei que os gastos deste mês passaram um pouquinho do que você recebe. Vamos organizar as continhas para não faltar no próximo mês?`;
  }

  let debtWarning = '';
  if (valDebts > valIncome * 0.2) {
    debtWarning = `Parece que os empréstimos e parcelas estão levando uma boa parte do seu dinheiro. Tente não fazer novos parcelamentos por enquanto, está bem?`;
  }

  let savingsPlan: string;
  const remainingForGoal = Math.max(0, valGoalCost - valSaved);
  
  if (remainingForGoal === 0) {
    savingsPlan = `Ótimas notícias! O dinheiro que você tem guardado já é suficiente para comprar sua "${goal}". Você já pode realizar seu sonho!`;
  } else if (balance > 0) {
    const months = Math.ceil(remainingForGoal / balance);
    savingsPlan = `Para comprar sua "${goal}", faltam apenas R$ ${remainingForGoal.toFixed(2)}. Se você guardar o que sobra por mês, em ${months} meses nós conseguiremos!`;
  } else {
    savingsPlan = `Para comprar sua "${goal}", precisamos primeiro arrumar as contas para sobrar um pouco todo mês. Cada pequeno passo ajuda!`;
  }

  return {
    healthScore,
    diagnosis,
    debtWarning,
    recommendations: [
      "Anote na geladeira o que realmente precisa comprar no mercado.",
      "Ligue para a operadora de telefone e veja se tem um plano mais barato."
    ],
    savingsPlan
  };
};
