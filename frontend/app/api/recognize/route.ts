import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const supportedTokens = [
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
  { id: "tay", urdu: "ت", english: "Letter Tay", gloss: "TAY", type: "alphabet" },
  { id: "jeem", urdu: "ج", english: "Letter Jeem", gloss: "JEEM", type: "alphabet" },
  { id: "daal", urdu: "د", english: "Letter Daal", gloss: "DAAL", type: "alphabet" },
  { id: "ray", urdu: "ر", english: "Letter Ray", gloss: "RAY", type: "alphabet" },
  { id: "seen", urdu: "س", english: "Letter Seen", gloss: "SEEN", type: "alphabet" },
  { id: "meem", urdu: "م", english: "Letter Meem", gloss: "MEEM", type: "alphabet" },
  { id: "noon", urdu: "ن", english: "Letter Noon", gloss: "NOON", type: "alphabet" },
  { id: "choti_ye", urdu: "ی", english: "Letter Ye", gloss: "CHOTI_YE", type: "alphabet" }
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { base64Image, sampleId } = body;

    // Fast-path: If a pre-recorded or demo sample ID is requested (FR-17 Demo Mode)
    if (sampleId) {
      const match = supportedTokens.find((t) => t.id === sampleId);
      if (match) {
        return NextResponse.json({
          ...match,
          confidence: 0.96,
          source: "demo_clip",
        });
      }
    }

    if (!base64Image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no Gemini API key is configured, fallback smoothly without throwing 500
    if (!apiKey) {
      return NextResponse.json({
        id: "none",
        warning: "GEMINI_API_KEY not configured. Running in client simulation & demo mode.",
        status: "idle",
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const base64Data = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const prompt = `
    You are an expert in Pakistani Sign Language (PSL). Analyze this video image frame and identify if the person is performing one of the following signs:
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
          role: "user",
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
      return NextResponse.json({ id: "none" });
    }

    const prediction = JSON.parse(response.text);

    if (prediction.id && prediction.id !== "none") {
      const tokenInfo = supportedTokens.find((t) => t.id === prediction.id);
      if (tokenInfo) {
        return NextResponse.json({
          ...tokenInfo,
          confidence: Number(prediction.confidence) || 0.85,
          source: "gemini_vision",
        });
      }
    }

    return NextResponse.json({ id: "none" });

  } catch (error: any) {
    console.error("[recognize API error]:", error.message);
    // Return gracefully instead of hard 500 so UI continuous loop stays intact
    return NextResponse.json({ id: "none", error: error.message }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "ready",
    supportedTokensCount: supportedTokens.length,
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    tokens: supportedTokens,
  });
}
