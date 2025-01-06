import {NextRequest, NextResponse} from 'next/server';
import {cookies} from 'next/headers';

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

    // convert company_activity_type from string to object
    let companyActivityTypesArray = []
    const companyActivityTypesValue = cookieStore.get("company_activity_types")?.value;
    if (companyActivityTypesValue) {
        try {
            companyActivityTypesArray = JSON.parse(companyActivityTypesValue);
        } catch (error) {
            console.error("Failed to parse company_activity_types as JSON:", error);
        }
    } else {
        console.log("No company_activity_types cookie found or it is empty.");
    }

    // Check if the device is mobile
    if (!userAgent.includes('Mobile')) {
        console.log('Non-mobile device detected. Redirecting to not-found.');
        return NextResponse.rewrite(new URL('/not-found', request.url));
    }

    // Check if token exists
    if (!cookieStore.has('token')) {
        if (!allowedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
            console.log('No token found. Redirecting to sign-in.');
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }
    } else {
        // Redirect to main page
        // if (
        //     Array.isArray(companyActivityTypesArray) &&
        //     companyActivityTypesArray.length > 0 &&
        //     request.nextUrl.pathname !== '/'
        // ) {
        //     console.log('Redirecting to main page because conditions are met.');
        //     return NextResponse.redirect(new URL('/', request.url));
        // }

        // Redirect to activity-type if the cookie exists and path is not already activity-type
        if (companyActivityTypesArray.length === 0 && request.nextUrl.pathname !== '/activity-type') {
            console.log('Redirecting to activity-type.');
            return NextResponse.redirect(new URL('/activity-type', request.url));
        }

        // Redirect to information if both cookies exist and path is not already information
        if (
            (cookieStore.get('industry')?.value) === "null" ||
            (cookieStore.get('job_title')?.value === "null") &&
            request.nextUrl.pathname !== '/information'
        ) {
            console.log('Redirecting to information.');
            return NextResponse.redirect(new URL('/information', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/((?!_next/static|_next/image|favicon.ico|activity-type|information).*)',
};
