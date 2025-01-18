import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import axios from "axios";
import {getCookie} from "cookies-next";

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

if (typeof window !== 'undefined') {
    window.Pusher = Pusher;

    window.Echo = new Echo<'reverb'>({
        broadcaster: 'reverb',
        key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
        channelAuthorization: {
            endpoint: `${process.env.NEXT_PUBLIC_BASE_URL_API}/broadcasting/auth`,
            headers: {
                Authorization: `Bearer ${getCookie("token")}`
            },
        },
        wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
        wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
        wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
        forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}

export const echo = typeof window !== 'undefined' ? window.Echo : null;
