import {NextRequest, NextResponse} from 'next/server';
import {UAParser} from "ua-parser-js";

export async function middleware(request: NextRequest) {
    const userAgent = request.headers.get('user-agent') || '';
    const allowedPaths = [
        '/sign-up',
        '/verify-code',
        '/sign-in',
        '/auth/linkedin/callback',
        '/splash-screen',
        '/auth/forgot-password',
    ];

    console.log('Path:', request.nextUrl.pathname);

    // Check if the device is mobile
    if (!userAgent.includes('Mobile')) {
        console.log('Non-mobile device detected. Redirecting to use-mobile.');
        return NextResponse.redirect(new URL('/use-mobile', request.url));
    }

    const isApp = userAgent.includes('LinkedMeet');
    const {os} = UAParser(userAgent);
    const isStandalone = request.cookies.get('isStandalone');

    if (isStandalone?.value === 'false' && os.name === 'Android') {
        return NextResponse.redirect(new URL('/download-app', request.url));
    }

    if (!isApp && os.name === 'iOS') {
        return NextResponse.redirect(new URL('/download-app', request.url));
    }

    // splash screen
    const hasSeenSplash = request.cookies.get('has_seen_splash');
    const splashScreenPath = '/splash-screen';
    if (!isApp && !hasSeenSplash && request.nextUrl.pathname !== splashScreenPath) {
        console.log('Redirecting to splash-screen.');
        const response = NextResponse.redirect(new URL(splashScreenPath, request.url));
        response.cookies.set('has_seen_splash', 'true');
        return response;
    }

    // Check if token exists
    if (!request.cookies.has('token')) {
        if (!allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
            console.log('No token found. Redirecting to sign-in.');
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    } else {

        // convert company_activity_type from string to object
        let companyActivityTypesArray = []
        const companyActivityTypesValue = request.cookies.get("company_activity_types")?.value;
        if (companyActivityTypesValue) {
            try {
                companyActivityTypesArray = JSON.parse(companyActivityTypesValue);
            } catch (error) {
                console.error("Failed to parse company_activity_types as JSON:", error);
            }
        } else {
            console.log("No company_activity_types cookie found or it is empty.");
        }

        // Redirect to activity-type if the cookie exists and path is not already activity-type
        if (companyActivityTypesArray.length === 0 && request.nextUrl.pathname !== '/activity-type') {
            console.log('Redirecting to activity-type.');
            return NextResponse.redirect(new URL('/activity-type', request.url));
        }

        // Redirect to information if both cookies exist and path is not already information
        if ((
            request.cookies.get('industry')?.value === "null" ||
            request.cookies.get('job_title')?.value === "null"
        ) && request.nextUrl.pathname !== '/information') {
            console.log('Redirecting to information.');
            return NextResponse.redirect(new URL('/information', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!_next/static|_next/image|manifest.webmanifest|icon.png|icon.svg|web-app-manifest-192x192.png|web-app-manifest-512x512.png|favicon.ico|apple-icon.png|manifest.json|activity-type|information|use-mobile|download-app|auth/reset-password).*)',
};
