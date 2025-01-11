import {Spinner} from "@nextui-org/react";

export default function LogoutPage(){
    return (
        <div className={"h-screen w-[100%] flex justify-center items-center gap-2 text-danger text-sm z-50"}>
            <Spinner color={"danger"} size={"sm"}/>
            Logging out
        </div>
    )
}
