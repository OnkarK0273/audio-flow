import { AuthToken, GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error: "GEMINI_API_KEY is not set on the server.",
        hasServerKey: false,
      },
      { status: 200 },
    );
  }

  try {
    const geminiClient = new GoogleGenAI({ apiKey });
    const expireTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    const token: AuthToken = await geminiClient.authTokens.create({
      config: {
        uses: 1,
        expireTime: expireTime,
        newSessionExpireTime: new Date(Date.now() + 2 * 60 * 1000).toISOString(),
        httpOptions: { apiVersion: "v1alpha" },
      },
    });

    return NextResponse.json({
      token,
      hasServerKey: true,
    });
  } catch (error: any) {
    console.error("Token creation error:", error);
    return NextResponse.json(
      {
        error: error?.message || "Failed to create ephemeral token",
        hasServerKey: true,
      },
      { status: 500 },
    );
  }
}
