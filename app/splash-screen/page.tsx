"use client"
import Image from "next/image";
import LinkedMeetIcon from "../../public/images/LinkedMeet.png"
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {Spinner} from "@nextui-org/react";
import {hasCookie} from "cookies-next";

export default function SplashScreenPage() {

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(hasCookie("token") ? '/' : '/sign-in');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={"flex flex-col items-center justify-between gap-2 h-screen p-5"}>
            <div></div>
            <div className={"flex flex-col gap-2 items-center"}>
                <Image src={LinkedMeetIcon} alt={"Splash Screen"} width={150} height={150}/>
                <div className={"font-mono"}>LinkedMeet</div>
            </div>
            <div className={"text-sm flex gap-2 mb-20"}>
                <Spinner size={"sm"} color={"primary"}/>
                Loading...
            </div>
        </div>

    )
}
