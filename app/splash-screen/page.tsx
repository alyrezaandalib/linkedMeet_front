import Image from "next/image";
import splashScreenImage from "../../public/images/splash-screen.png"
export default function SplashScreenPage() {
    return (
        <div className={"flex flex-col items-center justify-between gap-2 h-screen p-5"}>
            <div></div>
            <div className={"flex flex-col gap-2 items-center"}>
                <Image src={splashScreenImage} alt={"Splash Screen"} width={150} height={150}/>
                <div className={"font-mono"}>LinkedMeet</div>
            </div>
            <div className={"text-sm"}>Loading...</div>
        </div>

    )
}