"use client"
import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";
import {Input, Spinner, Button, Avatar} from "@heroui/react";
import useService, {Chats} from "./service";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import truncateMessage from "@/utils/truncateMessage";
import {formatDateToClientTimezone} from '@/utils/helpers';
import {updateUnreadMessages} from "@/store/notificationSlice";

// icons
import {CiSearch} from "react-icons/ci";
import {useSelector} from "react-redux";

export default function ChatPage() {

    const router = useRouter();
    // chats
    const [chatHistory, setChatHistory] = useState<Chats[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>(""); // State for search input

    // check notifications
    const notification = useSelector((state: any) => state.notification);

    // services
    const {getChatsList} = useService();
    const {data, isLoading, refetch} = getChatsList();

    useEffect(() => {
        if (data) {
            setChatHistory(data?.data);
        }
    }, [data]);

    useEffect(() => {
        if (notification.unreadMessagesCount > 0) {
            refetch();
        }
    }, [notification.unreadMessagesCount, refetch]);

    // Filtered chat list based on search query
    const filteredChats = chatHistory.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="px-5 pt-4">
                <div className="flex items-center mb-6">
                    <div
                        onClick={() => router.back()}
                        className="rounded-xl bg-white shadow-lg p-3 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        <IoIosArrowBack className="text-xl text-gray-700" />
                    </div>
                    <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Chats
                    </h1>
                </div>
            </div>

            <div className="flex justify-center items-start px-5">
                <div className="w-full max-w-md px-3">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Your Conversations
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Connect and chat with your network
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Search Input */}
                        <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CiSearch className="text-sm text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800 text-sm mb-1">Search Chats</h3>
                                    <Input
                                        variant="bordered"
                                        radius="lg"
                                        placeholder="Search for a user"
                                        startContent={
                                            <CiSearch className="text-sm text-gray-400 pointer-events-none flex-shrink-0"/>
                                        }
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="text-sm"
                                        size="sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chat List */}
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                            {isLoading ? (
                                <div className="h-64 flex justify-center items-center">
                                    <Spinner size="lg" />
                                </div>
                            ) : filteredChats && filteredChats?.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {filteredChats?.map((item: Chats) => (
                                        <div key={item.id} className="p-4 hover:bg-gray-50 transition-all duration-300">
                                            <Button
                                                onPress={() => router.push(`/chat/${item.id}?user=${encodeURIComponent(JSON.stringify(item))}`)}
                                                variant="light"
                                                size="lg"
                                                radius="lg"
                                                className="flex justify-start py-3 w-full px-3 h-auto"
                                            >
                                                <Avatar
                                                    isBordered
                                                    className="min-w-10 w-10 min-h-10 h-10 text-large"
                                                    src={item.avatar}
                                                    alt={item.name}
                                                />
                                                <div className="flex w-full items-center ml-3">
                                                    <div className="flex flex-col items-start gap-1 flex-1">
                                                        <div className="font-semibold text-gray-800 text-sm capitalize">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-gray-500 text-xs">
                                                            {truncateMessage(item.message)}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {item.has_new_messages > 0 && (
                                                            <div className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                                                                {item.has_new_messages}
                                                            </div>
                                                        )}
                                                        <div className="text-gray-400 text-xs">
                                                            {formatDateToClientTimezone(item.last_message_at, true)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-64 flex flex-col justify-center items-center text-center p-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-1">No conversations yet</p>
                                    <p className="text-xs text-gray-400">Start connecting with people to see chats here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 mb-2 text-center">
                        <p className="text-xs text-gray-400">
                            Stay connected with your network
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
