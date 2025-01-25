"use client";
import { ReactNode, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {Provider, useDispatch, useSelector} from "react-redux";
import store from "../store/index";
import { Toaster } from "react-hot-toast";
import { echo } from "@/utils/echo";
import { getCookie } from "cookies-next";
import { updateUnreadMessages } from "@/store/notificationSlice";

// Notification listener component
function NotificationListener() {
    const dispatch = useDispatch();

    const userId = useSelector((state: any) => state.user.user.id);

    useEffect(() => {
        if (userId && echo) {
            const channel = echo.private(`chat.user.${userId}`);
            channel.listen("NewMessageEvent", (message: any) => {
                console.log("New message received:", message);
                dispatch(updateUnreadMessages({
                    unreadMessagesCount: message.total_unread_messages,
                }));
            });

            if (echo) {
                echo.leaveChannel(`chat.user.${getCookie("id")}`);
            }
        }
    }, [userId, dispatch]);
    return null;
}

export default function CustomProvider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster position="top-center" reverseOrder={false} gutter={8} />
            <Provider store={store}>
                <NotificationListener />
                {children}
            </Provider>
        </QueryClientProvider>
    );
}
