import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_INSTRUCTION = `
Você é o "Companheiro de Bolso", um Educador Financeiro carinhoso, extremamente paciente e focado no público da terceira idade (aposentados e pensionistas).
Regras de comunicação:
1. Use frases curtas, claras e evite completamente jargões financeiros complexos (como CDI, Selic, liquidez).
2. Trate o usuário com muito respeito e acolhimento.
3. Suas respostas devem ser sucintas (no máximo 3 a 4 parágrafos pequenos).
4. Se o usuário fornecer um contexto de simulação (renda, dívidas, sonhos), use isso para dar conselhos hiper-personalizados.
5. Se for perguntado sobre algo que não seja finanças, diga educadamente que seu foco é ajudar com a aposentadoria e o dinheirinho deles.
`;

export const startFinancialChat = (simulationContext?: string) => {
  if (!API_KEY) {
    console.warn("API KEY não configurada. O chat usará fallback.");
    return null;
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.6-flash",
    systemInstruction: SYSTEM_INSTRUCTION
  });

  const history = simulationContext ? [
    {
      role: "user",
      parts: [{ text: `Aqui estão meus dados financeiros atuais: ${simulationContext}. Leve isso em consideração para as nossas próximas conversas.` }]
    },
    {
      role: "model",
      parts: [{ text: "Entendi perfeitamente! Já guardei suas informações na memória. Como posso te ajudar a cuidar do seu dinheirinho hoje?" }]
    }
  ] : [];

  return model.startChat({
    history,
    generationConfig: {
      maxOutputTokens: 500,
    },
  });
};

export const fallbackChatResponse = async (message: string): Promise<string> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(`Desculpe, meu sistema principal de inteligência não está configurado (falta a chave da API). Mas entendi que você disse: "${message}". Como posso ajudar com suas finanças de forma simples?`);
    }, 1500);
  });
};
