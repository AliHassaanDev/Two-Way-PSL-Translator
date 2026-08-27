import { NextRequest, NextResponse } from "next/server";
import { urduToPSLModel } from "@/app/lib/urdutopsl-model";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid request. 'text' field is required." },
        { status: 400 }
      );
    }

    const inferenceResult = await urduToPSLModel.infer(text);

    return NextResponse.json({
      success: true,
      model: "urdutopsl",
      data: inferenceResult,
    });
  } catch (error: unknown) {
    console.error("[POST /api/translate error]:", error);
    return NextResponse.json(
      { error: "Internal translation inference error", details: (error as Error)?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    model: "urdutopsl",
    status: "ready",
    architecture: "Hybrid Sequence Resolver + PSL Fingerspelling Fallback",
    supportedClasses: 60,
    alphabetClasses: 36,
  });
}
