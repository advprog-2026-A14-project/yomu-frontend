import { register, contentType } from "prom-client";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const metrics = await register.metrics();
    return new NextResponse(metrics, {
      status: 200,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to collect metrics" },
      { status: 500 }
    );
  }
}
