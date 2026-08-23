import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const supportedTokens = [
  { id: "salam", urdu: "السلام علیکم", english: "Hello / Peace be upon you", gloss: "HELLO", type: "word" },
  { id: "aap_kaisay", urdu: "آپ کیسے ہیں؟", english: "How are you?", gloss: "HOW_ARE_YOU", type: "word" },
  { id: "shukriya", urdu: "شکریہ", english: "Thank you", gloss: "THANK_YOU", type: "word" },
  { id: "madad", urdu: "مدد", english: "Help", gloss: "HELP", type: "word" },
  { id: "paani", urdu: "پانی", english: "Water", gloss: "WATER", type: "word" },
  { id: "doctor", urdu: "ڈاکٹر", english: "Doctor", gloss: "DOCTOR", type: "word" },
  { id: "pakistan", urdu: "پاکستان", english: "Pakistan", gloss: "PAKISTAN", type: "word" },
  { id: "haan", urdu: "ہاں", english: "Yes", gloss: "YES", type: "word" },
  { id: "nahin", urdu: "نہیں", english: "No", gloss: "NO", type: "word" },
  { id: "naam", urdu: "میرا نام", english: "My name is", gloss: "MY_NAME", type: "word" },
  { id: "alif", urdu: "ا", english: "Letter Alif", gloss: "ALIF", type: "alphabet" },
  { id: "bay", urdu: "ب", english: "Letter Bay", gloss: "BAY", type: "alphabet" },
  { id: "pay", urdu: "پ", english: "Letter Pay", gloss: "PAY", type: "alphabet" },
  { id: "meem", urdu: "م", english: "Letter Meem", gloss: "MEEM", type: "alphabet" },
  { id: "noon", urdu: "ن", english: "Letter Noon", gloss: "NOON", type: "alphabet" }
];

export async function POST(req: Request) {
  try {
    const { base64Image } = await req.json();

    if (!base64Image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Clean up base64 string if it contains the data URI prefix
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const prompt = `
    You are an expert in Pakistani Sign Language (PSL). Analyze this image frame and identify if the person is performing one of the following signs:
    ${supportedTokens.map(t => `- ${t.id} (${t.english} / ${t.urdu})`).join("\n")}
    
    If no clear sign is detected or it's mostly idle, return "none".
    Return the result strictly as a JSON object with the following fields:
    - id: The exact id of the recognized sign from the list above, or "none".
    - confidence: A float between 0.0 and 1.0 representing your confidence.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Data,
                mimeType: "image/jpeg"
              }
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
        throw new Error("No text response from Gemini");
    }

    const prediction = JSON.parse(response.text);

    // If a valid sign was detected, augment it with the full metadata
    if (prediction.id && prediction.id !== "none") {
      const tokenInfo = supportedTokens.find((t) => t.id === prediction.id);
      if (tokenInfo) {
        return NextResponse.json({
          ...tokenInfo,
          confidence: prediction.confidence || 0.8
        });
      }
    }

    // Return empty if nothing recognized
    return NextResponse.json({ id: "none" });

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
