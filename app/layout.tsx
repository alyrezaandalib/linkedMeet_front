import type {Metadata} from "next";
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

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} antialiased sm:hidden`}
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
