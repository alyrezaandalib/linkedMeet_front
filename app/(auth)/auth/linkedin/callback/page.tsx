import { Spinner} from "@nextui-org/react";

export default function Page(){
    return(
        <div className={"h-screen flex flex-col justify-center items-center gap-5 bg-white"}>
            <Spinner color={"primary"}/>
            <div className={"font-mono text-sm"}>Please wait a few moments.</div>
        </div>
    )
}