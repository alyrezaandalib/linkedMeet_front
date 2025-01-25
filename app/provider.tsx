"use client";
import {ReactNode, useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider, useDispatch, useSelector} from "react-redux";
import store from "../store/index";
import {Toaster} from "react-hot-toast";
import {initializeEcho} from "@/utils/echo";
import {updateUnreadMessages} from "@/store/notificationSlice";

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
