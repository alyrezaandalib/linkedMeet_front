import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";

export default function ChatPage() {
    return (
        <div className={"px-2 pt-4"}>
            <div className="flex items-center px-3">
                <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </Link>
                <h1 className="ml-2 text-lg font-bold">Chat</h1>
            </div>
            <div className={"leading-7 p-4 font-light text-gray-800"}>
            </div>
        </div>
    )
}