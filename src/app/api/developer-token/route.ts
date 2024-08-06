import { generateJWT } from "@/lib/generateJWT";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  console.log("Generating Developer Token");
  try {
    const token = generateJWT();
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating developer token:", error);
    return NextResponse.json(
      { error: "Failed to generate developer token" },
      { status: 500 }
    );
  }
}
