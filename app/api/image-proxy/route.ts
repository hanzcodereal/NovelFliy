import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  
  if (!url) return new NextResponse("URL is required", { status: 400 });
  
  try {
    const response = await fetch(url, {
      headers: {
        'Referer': 'https://www.webtoons.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to proxy image: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const headers = new Headers();
    const contentType = response.headers.get('content-type');
    if (contentType) {
      headers.set('Content-Type', contentType);
    }
    headers.set('Cache-Control', 'public, max-age=31536000');

    return new NextResponse(arrayBuffer, {
      headers,
      status: 200,
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new NextResponse("Failed to proxy image", { status: 500 });
  }
      }
