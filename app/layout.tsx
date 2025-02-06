import type {Metadata, Viewport} from "next";
import localFont from "next/font/local";
import "./globals.css";

// next ui provider
import {HeroUIProvider} from "@heroui/react";
import CustomProvider from "@/app/provider";

const geistSans = localFont({
    src: "../public/fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});

export const metadata: Metadata = {
    title: "LinkedMeet",
    description: "LinkedMeet",
    appleWebApp: {
        title: "LinkedMeet",
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} antialiased`}
        >
        <HeroUIProvider>
            <CustomProvider>
                {children}
            </CustomProvider>
        </HeroUIProvider>
        </body>
        </html>
    )
}
