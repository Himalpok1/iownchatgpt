import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const responseSchema = {
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

export async function POST(request: Request) {
  try {
    const { fen, history } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { move: "", commentary: "AI is unavailable — GEMINI_API_KEY not configured." },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a chess engine playing at Grandmaster level.
Current Board FEN: ${fen}
Move History (SAN): ${Array.isArray(history) ? history.join(" ") : ""}

Analyze the position and determine the absolute best move for the current turn color.
Provide the move in Standard Algebraic Notation (SAN).
Also provide a short commentary on why this move is good or comment on the opponent's last move.
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.3,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    const result = JSON.parse(text);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Chess API error:", error);
    return NextResponse.json({
      move: "",
      commentary: "I'm having trouble concentrating on the board right now.",
    });
  }
}
