"use client"

import {useRouter} from "next/navigation";
import {Input, Button} from "@nextui-org/react";

// icons
import {RiSendPlaneFill} from "react-icons/ri";
import {FaUserCircle} from "react-icons/fa";
import {IoIosArrowBack} from "react-icons/io";

const ChatPage = () => {
    const router = useRouter();
    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="flex items-center bg-white px-4 py-3 shadow-md">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </button>
                <div className="flex items-center ml-4">
                    <div
                        className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <FaUserCircle className="text-gray-400 h-8 w-8"/>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">mohammad j4</p>
                        <p className="text-xs text-gray-500">Graphic Design / Analyst</p>
                    </div>
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-6 bg-gray-50">
                {/* Received Message */}
                <div className="flex flex-col gap-1 items-start">
                    <div className="bg-white max-w-[80%] text-gray-700 px-4 py-3 rounded-lg shadow-sm">
                        Hello, good time <br/> May I know your field of work?
                    </div>
                    <p className="text-xs text-gray-400 mt-1">5:32</p>
                </div>
                {/* Sent Message */}
                <div className="flex flex-col gap-1 items-end">
                    <div className="bg-blue-500 max-w-[80%] text-white px-4 py-3 rounded-lg shadow-sm">
                        Hi <br/> I am a UI/UX designer
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">5:32</p>
                </div>
            </main>

            {/* Message Input */}
            <footer className="flex items-center bg-white gap-2 px-4 py-3 border-t">
                <Input placeholder={"Write a message..."} variant={"bordered"}/>
                <Button isIconOnly radius={"full"} variant={"light"}><RiSendPlaneFill className={"text-2xl"}/></Button>
            </footer>
        </div>
    );
};

export default ChatPage;
