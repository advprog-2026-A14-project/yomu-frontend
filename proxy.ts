import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/v1/auth') || pathname.startsWith('/api/v1/users')) {
    const url = new URL(request.url);
    const apiBaseUrl = process.env.NEXT_PUBLIC_YOMU_API_BASE_URL;

    if (!apiBaseUrl) {
      return NextResponse.json(
        { success: false, message: 'NEXT_PUBLIC_YOMU_API_BASE_URL belum diatur' },
        { status: 500 },
      );
    }

    const targetUrl = `${apiBaseUrl.replace(/\/$/, '')}${pathname}${url.search}`;

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual',
      credentials: 'include',
    });

    const response = await fetch(proxyRequest);

    const responseHeaders: HeadersInit = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: responseHeaders,
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/v1/:path*'],
};
