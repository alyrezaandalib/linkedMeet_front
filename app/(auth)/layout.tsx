"use client"

// react query provider
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {

    const queryClient = new QueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <div className={"bg-black"}>
                {children}
            </div>
        </QueryClientProvider>

    );
}
