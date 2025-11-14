import { NextRequest, NextResponse } from "next/server";

const BASE_URL = "https://v3.football.api-sports.io";

export async function GET() {
  const apiKey = process.env.APISPORTS_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Chýba API kľúč" },
      { status: 500 }
    );
  }

  const url = `${BASE_URL}/fixtures?live=all`;

  try {
    const res = await fetch(url, {
      headers: {
        "x-apisports-key": apiKey, 
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "API chyba", status: res.status },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Nepodaril sa fetch" },
      { status: 500 }
    );
  }
}
