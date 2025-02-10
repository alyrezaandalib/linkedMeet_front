"use client";
import {ReactNode, useEffect, useState} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider, useDispatch, useSelector} from "react-redux";
import store from "../store/index";
import {Toaster} from "react-hot-toast";
import {initializeEcho} from "@/utils/echo";
import {updateUnreadMessages} from "@/store/notificationSlice";
import { UAParser } from "ua-parser-js";
import {useRouter, usePathname} from "next/navigation";

// Notification listener component
function NotificationListener() {
    const dispatch = useDispatch();

    const userId = useSelector((state: any) => state.user.user.id);
    const userToken = useSelector((state: any) => state.user.token);

    useEffect(() => {
        if (userToken && userId) {
            const echo = initializeEcho(userToken);
            // @ts-ignore
            const channel = echo.private(`chat.user.${userId}`);
            channel.listen("NewMessageEvent", (message: any) => {
                dispatch(updateUnreadMessages({
                    unreadMessagesCount: message.total_unread_messages,
                }));
            });
        }
    }, [userId, userToken, dispatch]);

    return null;
}

export default function CustomProvider({children}: { children: ReactNode }) {
    const queryClient = new QueryClient();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const userAgent = navigator.userAgent || '';
        const { os } = UAParser(userAgent);

        const standalone =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone === true;

        if (!standalone  && os.name === 'Android' && pathname != '/auth/reset-password') {
            router.push('/download-app');
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-center" reverseOrder={false} gutter={8}/>
            <Provider store={store}>
                <NotificationListener/>
                {children}
            </Provider>
        </QueryClientProvider>
    );
}
