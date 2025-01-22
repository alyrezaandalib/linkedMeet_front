import {Spinner} from "@heroui/react";

export default function Loading(){
    return (
        <div className={"h-screen w-full flex items-center justify-center"}>
            <Spinner color={"primary"}/>
        </div>
    )
}