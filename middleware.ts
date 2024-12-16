import {NextRequest, NextResponse} from 'next/server';

export function middleware(request: any) {
    const userAgent = request.headers.get('user-agent') || '';

    if (!userAgent.includes('Mobile')) {
        console.log("mobile")
        return NextResponse.rewrite(new URL('/not-found', request.url))
    }
}
