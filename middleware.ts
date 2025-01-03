import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
    const cookieStore = await cookies();

    // مسیری که نباید میدل‌ویر بر روی آن اعمال شود
    const allowedPaths = ['/sign-up', '/verify-code', '/sign-in' , '/auth/linkedin/callback'];

    // اگر توکن وجود ندارد و مسیر در allowedPaths نباشد، ریدایرکت به صفحه ورود
    if (!cookieStore.has('token')) {
        // اگر مسیر درخواست شده غیر از مسیرهای مجاز باشد، ریدایرکت به صفحه ورود
        if (!allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
            console.log('Access denied. Redirecting to sign-in.');
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    }

    // اگر هیچ مشکلی وجود نداشت و مسیر مورد نظر مجاز بود، ادامه می‌دهیم
    return NextResponse.next();
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico).*)', // این مسیرها به میدل‌ویر نمی‌آیند
};
