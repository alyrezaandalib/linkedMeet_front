import Pusher from 'pusher-js';
import Echo from 'laravel-echo';
import {getCookie} from "cookies-next";

// @ts-ignore
let echoInstance: Echo<any> | null = null;

declare global {
    interface Window {
        Pusher: typeof Pusher;
    }
}

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;
}

// @ts-ignore
export const echo = (): Echo<any> | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!echoInstance) {
        echoInstance = new Echo({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            auth: {
                headers: {
                    Authorization: `Bearer ${getCookie('token')}`,
                },
            },
        });
    }

    return echoInstance;
};
