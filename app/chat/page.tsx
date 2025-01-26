"use client"
import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";
import {Input, Spinner, Button} from "@heroui/react";
import useService, {Chats} from "./service";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import truncateMessage from "@/utils/truncateMessage";
// icons
import {CiSearch} from "react-icons/ci";

export default function ChatPage() {

    const router = useRouter();
    // chats
    const [chatHistory, setChatHistory] = useState<Chats[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input

    // services
    const {getChatsList} = useService();
    const {data, isLoading} = getChatsList();

    useEffect(() => {
        if (data) {
            setChatHistory(data?.data);
        }
    }, [data]);

    // Filtered chat list based on search query
    const filteredChats = chatHistory.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={"pt-4 px-4 h-screen bg-[#f9f9f9] flex flex-col gap-4"}>
            <div className={"flex items-center gap-5"}>
                <div className="flex items-center">
                    <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                        <IoIosArrowBack className={"text-lg"}/>
                    </Link>
                    <h1 className="ml-2 text-lg font-bold">Chats</h1>
                </div>
                <Input
                    variant={"bordered"}
                    radius={"sm"}
                    placeholder="Search for a user"
                    startContent={
                        <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    type="text"
                    value={searchQuery} // Bind input to state
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query on change
                />
            </div>
            <div className={"bg-white rounded-t-xl h-[calc(100%-40px)] w-full p-1.5 overflow-y-auto"}>
                {
                    isLoading ?
                        <div className={"h-full flex justify-center items-center"}>
                            <Spinner/>
                        </div>
                        :
                        (filteredChats && filteredChats.length > 0 ?
                                filteredChats.map((item: Chats) => (
                                    <div key={item.id}>
                                        <Button
                                            key={item.id}
                                            onPress={() => router.push(`/chat/${item.id}?user=${encodeURIComponent(JSON.stringify(item))}`)}
                                            variant={"light"}
                                            size={"lg"}
                                            radius={"sm"}
                                            className={"flex justify-start py-8 w-full px-2"}
                                        >
                                            <div className={"min-w-10 h-10 rounded-full bg-gray-200/50"}>
                                                <img src={item.avatar} alt={item.name}
                                                     className={"rounded-full h-full w-full bg-gray-200 border border-gray-300 !max-w-10 !max-h-10"}/>
                                            </div>
                                            <div className={"flex w-full items-end"}>
                                                <div className={"flex flex-col items-start gap-1 w-full"}>
                                                    <div className={"capitalize"}>{item.name}</div>
                                                    <div
                                                        className={"text-gray-400 text-sm"}>{truncateMessage(item.message)}</div>
                                                </div>
                                                <div className={"flex flex-col items-end gap-2"}>
                                                    {
                                                        item.has_new_messages > 0 &&
                                                        <div
                                                            className={"bg-danger rounded-full w-5 h-5 flex items-center justify-center text-xs text-white p-0.5"}>
                                                            {item.has_new_messages}
                                                        </div>
                                                    }
                                                    <div
                                                        className={"text-gray-400 w-fit text-xs"}>{item.last_message_at}</div>
                                                </div>
                                            </div>
                                        </Button>
                                        <div
                                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>
                                )) : <div className={"h-full flex justify-center items-center text-sm text-gray-500"}>
                                    No users to display.
                                </div>
                        )
                }
            </div>
        </div>
    )
}
