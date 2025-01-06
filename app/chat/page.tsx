"use client"
import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";
import {Input, Spinner} from "@nextui-org/react";
import useService, {Chats} from "./service";
import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "@nextui-org/button";
// icons
import {CiSearch} from "react-icons/ci";


export default function ChatPage() {

    const router = useRouter();

    const {getChatsList} = useService()
    const {data, isLoading} = getChatsList()

    return (
        <div className={"pt-4 px-4 h-screen bg-[#f9f9f9] flex flex-col gap-4"}>
            <div className={"flex items-center gap-5"}>
                <div className="flex items-center">
                    <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                        <IoIosArrowBack className={"text-lg"}/>
                    </Link>
                    <h1 className="ml-2 text-lg font-bold">Chat</h1>
                </div>
                <Input
                    variant={"bordered"}
                    radius={"sm"}
                    placeholder="Search"
                    startContent={
                        <CiSearch className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    type="email"
                />
            </div>
            <div className={"bg-white rounded-t-xl h-[calc(100%-40px)] w-full p-1.5 overflow-y-auto"}>
                {
                    isLoading ?
                       <div className={"h-full flex justify-center items-center"}>
                           <Spinner/>
                       </div>
                        :
                        (data && data?.data.length > 0 ?
                            data?.data.map((item: Chats) => (
                                <>
                                    <Button
                                        key={item.id}
                                        onPress={() => router.push(`/chat/${item.id}`)}
                                        variant={"light"}
                                        size={"lg"}
                                        radius={"sm"}
                                        className={"flex justify-start py-8 w-full px-2.5"}
                                    >
                                        <div className={"w-10 h-10 rounded-full bg-gray-200/50"}>
                                            <img src={item.avatar} alt={item.name}
                                                 className={"h-full w-full rounded-full"}/>
                                        </div>
                                        <div className={"capitalize "}>{item.name}</div>
                                    </Button>
                                    <div
                                        className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                </>
                            )) : <div className={"h-full flex justify-center items-center"}>
                                There is no chat to display.
                            </div>)
                }
            </div>
        </div>
    )
}