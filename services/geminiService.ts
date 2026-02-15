
import { GoogleGenAI, Type } from "@google/genai";

// The API key is handled externally via process.env.API_KEY. Use it directly to ensure compatibility.
/* Fix: Always use the standard initialization pattern from guidelines */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBriefing = async (title: string, format: string, channel: string) => {
  try {
    /* Fix: Calling generateContent with the correct model alias for text tasks */
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere um briefing de marketing criativo para um conteúdo chamado "${title}". 
      Formato: ${format}. Canal: ${channel}. 
      O briefing deve conter: Objetivo, Público-alvo, Referências visuais e Texto de apoio (copy). 
      Seja profissional e persuasivo.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    /* Fix: Directly access the .text property (not a method) as required */
    return response.text;
  } catch (error) {
    console.error("Erro ao gerar briefing com IA:", error);
    return "Não foi possível gerar o briefing automaticamente. Por favor, escreva manualmente.";
  }
};
