"use client";
import LinkedMeetIcon from "../../public/images/LinkedMeet.png"
import Image from "next/image";
import {useEffect, useState} from "react";
import {UAParser} from "ua-parser-js";
import {Spinner} from "@heroui/react";

export default function Page() {

    const [isAndroid, setIsAndroid] = useState(false);
    const [isIos, setIsIos] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent || '';
        const { os } = UAParser(userAgent);
        setIsAndroid(os.name === 'Android');
        setIsIos(os.name === 'iOS');
    }, []);

    if (isAndroid) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
                <Image src={LinkedMeetIcon} alt={"LinkedMeet"} className="w-24 h-24 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Welcome to LinkedMeet!</h1>

                <p className="text-center text-sm mb-6">Add LinkedMeet to your home screen.</p>

                <ol className="list-decimal list-inside space-y-2 w-full max-w-md">
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full mr-2 bg-black text-white"> 1 </span>
                        Open LinkedMeet in your browser.
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full mr-2 bg-black text-white"> 2 </span>
                        Tap the menu (three dots).
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full mr-2 bg-black text-white"> 3 </span>
                        Select "Add to Home screen".
                    </li>
                    <li className="flex items-center">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full mr-2 bg-black text-white"> 4 </span>
                        Follow the instructions.
                    </li>
                </ol>
            </div>
        );
    }

    if (isIos) {
        return (
            <div className="bg-background text-foreground min-h-screen flex flex-col justify-center items-center">
                <Image src={LinkedMeetIcon} alt={"LinkedMeet"} className="w-24 h-24 mb-4" />
                <h1 className="text-3xl font-bold mb-2">Welcome to LinkedMeet!</h1>
                <p className="text-center mb-4">To start using LinkedMeet, download it from the Apple App Store.</p>
                <a href="#"
                   className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/80 transition-colors">
                    Download on the App Store
                </a>
            </div>
        );
    }

    return (
        <div className={"h-screen w-full flex justify-center items-center gap-2 text-sm z-50"}>
            <Spinner size={"sm"}/>
            Loading...
        </div>
    );
}
