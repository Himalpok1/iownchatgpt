import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AiResponse } from '../types';

const apiKey = process.env.API_KEY || '';
// Initialize seamlessly; if no key, we handle gracefully in UI or mock for safety if needed,
// but instructions say assume valid env.
const ai = new GoogleGenAI({ apiKey });

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    move: {
      type: Type.STRING,
      description: "The best chess move in SAN (Standard Algebraic Notation), e.g., 'Nf3', 'exd5'.",
    },
    commentary: {
      type: Type.STRING,
      description: "A brief, witty, or insightful comment about the board state or the move chosen. Max 2 sentences.",
    },
  },
  required: ["move", "commentary"],
};

export const getBestMove = async (fen: string, history: string[], difficulty: string = 'Grandmaster'): Promise<AiResponse> => {
  try {
    const modelId = 'gemini-2.5-flash'; // Using the fast model for responsiveness
    
    const prompt = `
      You are a chess engine playing at ${difficulty} level.
      Current Board FEN: ${fen}
      Move History: ${history.join(' ')}
      
      Analyze the position and determine the absolute best move for the current turn color.
      Provide the move in Standard Algebraic Notation (SAN).
      Also provide a short commentary on why this move is good or comment on the opponent's last move.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.3, // Lower temperature for more reliable logic
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const result = JSON.parse(text) as AiResponse;
    return result;

  } catch (error) {
    console.error("Gemini AI Error:", error);
    // Fallback in case of error to avoid crashing the game loop, though in a real app we might show an error
    return {
      move: '',
      commentary: "I'm having trouble concentrating on the board right now.",
    };
  }
};
