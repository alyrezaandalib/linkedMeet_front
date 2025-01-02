"use client"
import {ReactNode} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Provider} from "react-redux"
import store from "../store/index"
import {Toaster} from "react-hot-toast";

export default function CustomProvider({children}: { children: ReactNode }) {
    const queryClient = new QueryClient()
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