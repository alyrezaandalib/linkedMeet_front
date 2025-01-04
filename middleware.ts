import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();
    const userAgent = request.headers.get('user-agent') || '';
    const allowedPaths = [
        '/sign-up',
        '/verify-code',
        '/sign-in',
        '/auth/linkedin/callback',
    ];

    console.log('Path:', request.nextUrl.pathname);

    // چک موبایل بودن
    if (!userAgent.includes('Mobile') && !request.nextUrl.pathname.startsWith('/auth/linkedin/callback')) {
        return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    // چک وجود توکن و مسیرهای مجاز
    if (!cookieStore.has('token')) {
        if (!allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
            console.log('Access denied. Redirecting to sign-in.');
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
