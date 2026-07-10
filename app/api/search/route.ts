import { NextRequest, NextResponse } from "next/server";
import { searchWebtoons } from "@/lib/webtoons-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  
  if (!q) return NextResponse.json({ error: "Query is required" }, { status: 400 });
  
  try {
    const data = await searchWebtoons(q);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 });
  }
}
