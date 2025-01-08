import type {Metadata} from "next";
import localFont from "next/font/local";
import "./globals.css";

// next ui provider
import {NextUIProvider} from "@nextui-org/react";
import CustomProvider from "@/app/provider";

const geistSans = localFont({
    src: "../public/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "LinkedMeet",
    description: "LinkedMeet",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} antialiased md:hidden`}
        >
        <NextUIProvider>
            <CustomProvider>
                {children}
            </CustomProvider>
        </NextUIProvider>
        </body>
        </html>
    )
}
