"use client"
import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";
import {Input} from "@nextui-org/react";
import useService, {Chats} from "./service";

// icons
import {CiSearch} from "react-icons/ci";
import {Button} from "@nextui-org/button";
import React from "react";
import {useRouter} from "next/navigation";

export default function ChatPage() {

    const router = useRouter();

    const {getChatsList} = useService()
    // const {data, isLoading, isError} = getChatsList
    const data = [
        {
            id: 1,
            first_name: "moein",
            last_name: "bakhtnama",
            image: ""
        }, {
            id: 2,
            first_name: "mohammad",
            last_name: "j4",
            image: ""
        }, {
            id: 3,
            first_name: "alireza",
            last_name: "andalib",
            image: ""
        },
    ]

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
            <div className={"bg-white rounded-t-xl h-[calc(100%-40px)] w-full p-3"}>
                {
                    data.map((item: Chats, index: number) => (
                        <>
                            <Button
                                key={index}
                                onPress={() => router.push(`/chat/${item.id}`)}
                                variant={"light"}
                                size={"lg"}
                                radius={"sm"}
                                className={"flex justify-start py-8 w-full"}
                            >
                                <div className={"w-10 h-10 rounded-full bg-red-100"}></div>
                                <div className={"capitalize "}>{item.first_name + " " + item.last_name}</div>
                            </Button>
                            <div
                                className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}