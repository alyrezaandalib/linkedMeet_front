"use client"
import {ReactNode, useEffect} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider, useSelector} from "react-redux"
import store from "../store/index"
import {Toaster} from "react-hot-toast";
import {echo} from "@/utils/echo";
import {getCookie} from "cookies-next";


export default function CustomProvider({children}: { children: ReactNode }) {
    const queryClient = new QueryClient()

    // check notifications
    useEffect(() => {
        if (echo) {
            echo.private(`chat.user.${getCookie("id")}`)
                .listen('NewMessageEvent', (e : any) => {
                    console.log('New message received:', e.message);
                });
        }

        return () => {
            if (echo) {
                echo.leaveChannel(`chat.user.${getCookie("id")}`);
            }
        };
    }, [getCookie("id")]);

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
            />
            <Provider store={store}>
                {children}
            </Provider>
        </QueryClientProvider>

    )
}
