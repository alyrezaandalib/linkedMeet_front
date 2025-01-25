import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo: Echo<'reverb'>;
    }
}

let echoInstance: Echo<'reverb'> | null = null;

export const initializeEcho = (token: string) => {
    if (typeof window === 'undefined') {
        return null;
    }

    if (!echoInstance) {
        window.Pusher = Pusher;

        echoInstance = new Echo<'reverb'>({
            broadcaster: 'reverb',
            key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
            channelAuthorization: {
                endpoint: `${process.env.NEXT_PUBLIC_BASE_URL_API}/broadcasting/auth`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
            wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
            wsPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 80,
            wssPort: process.env.NEXT_PUBLIC_REVERB_PORT ?? 443,
            forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
        });
    }

    return echoInstance;
};
