"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Spinner } from "@nextui-org/react";
import useService, { Message, Chat } from "./service";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getCookie } from "cookies-next";
import { echo } from '@/utils/echo';
// icons
import { FaUserCircle } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import SendIcon from "@/public/tsx-icons/send";



const ChatPage = () => {
    const userId = useSelector((state: any) => state.user.user.id);

    // Get user info from route query
    const searchParams = useSearchParams();
    const user = searchParams.get("user");
    const parsedUser = user ? JSON.parse(decodeURIComponent(user)) : null;

    // Form handling
    const { register, handleSubmit, resetField } = useForm<Message>();

    // Service hooks
    const { getChatHistory, sendMessage } = useService();

    // Chat state
    const [chatHistory, setChatHistory] = useState<any>([]);
    const [metaData, setMetaData] = useState({ total_pages: 1, current_page: 1 });
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isLoadingInitial, setIsLoadingInitial] = useState(true);  // Track initial loading

    const { data: chatHistoryResponse, isLoading } = getChatHistory(
        parsedUser.id,
        currentPage
    );

    // Scroll to bottom when new data is loaded
    const scrollToBottom = () => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Reference to scroll to the bottom of chat
    const chatEndRef = useRef<HTMLDivElement | null>(null);

    // web socket
    const channelName = `chat.${Math.min(userId, parsedUser.id)}-${Math.max(userId, parsedUser.id)}`;

    // Initialize chat history and meta data
    useEffect(() => {
        if (echo) {
            echo.private(channelName)
                .listen('MessageSent', (data: any) => {
                    console.log('Event received:', data);
                });
        }

        if (chatHistoryResponse && isLoadingInitial) {
            setChatHistory(chatHistoryResponse.data);
            setMetaData({
                total_pages: chatHistoryResponse.meta.total_pages,
                current_page: chatHistoryResponse.meta.current_page,
            });
            setCurrentPage(chatHistoryResponse.meta.current_page); // Set current page
            setTimeout(() => {
                scrollToBottom();
            }, 100);
            setIsLoadingInitial(false);  // Set to false after initial load
        }

        return () => {
            if (echo) {
                echo.leaveChannel(channelName);
            }
        };
    }, [chatHistoryResponse, isLoadingInitial]);

    // Load more messages
    const fetchChatHistory = async (partner_id: number, page: number) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/chat/history?partner_id=${partner_id}&page=${page}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie("token")}`,
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch chat history.");
        }
        return await response.json();
    };

    const loadMoreMessages = async () => {
        if (currentPage >= metaData.total_pages) {
            toast.error("No more messages to load.");
            return;
        }

        setIsLoadingMore(true);
        const nextPage = currentPage + 1;

        try {
            const response = await fetchChatHistory(parsedUser.id, nextPage);
            if (response?.data?.length) {
                setChatHistory((prevHistory: any) => [ ...response.data,...prevHistory]);
                setMetaData({
                    total_pages: response.meta.total_pages,
                    current_page: response.meta.current_page,
                });
                setCurrentPage(nextPage);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Handle message send
    const onSubmit: SubmitHandler<Message> = (data: any) => {
        data.receiver_id = parsedUser?.id;

        sendMessage.mutate(data, {
            onSuccess: () => {
                resetField("message");
                setChatHistory((prevHistory = []) => [
                    ...prevHistory,
                    {
                        id: Math.random(),
                        receiver_id: data.receiver_id,
                        sender_id: userId,
                        message: data.message,
                        created_at: "",
                    },
                ]);
                setTimeout(() => {
                    scrollToBottom();
                }, 100);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const router = useRouter();

    // Handle scroll to load more messages
    const handleScroll = (event: React.UIEvent) => {
        const bottom = event.currentTarget.scrollHeight === event.currentTarget.scrollTop + event.currentTarget.clientHeight;
        if (bottom && currentPage < metaData.total_pages) {
            loadMoreMessages();
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="flex items-center bg-white px-4 py-3 shadow-sm fixed top-0 w-full">
                <button
                    onClick={() => router.back()}
                    className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200"
                >
                    <IoIosArrowBack className={"text-lg"} />
                </button>
                <div className="flex items-center ml-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        <FaUserCircle className="text-gray-400 h-8 w-8" />
                        <img
                            alt={parsedUser.name}
                            src={parsedUser.avatar}
                            className={"rounded-full h-full w-full"}
                        />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-gray-800">
                            {parsedUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            {parsedUser.job_title} / {parsedUser.industry}
                        </p>
                    </div>
                </div>
            </header>

            {/* Chat Messages */}
            <main
                className="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-6 bg-gray-50 my-[64px] mb-[75px]"
                onScroll={handleScroll}
            >
                {isLoading ? (
                    <Spinner />
                ) : (
                    <>
                        {metaData.current_page < metaData.total_pages && (
                            <button
                                className="mt-4 text-sm text-primary"
                                onClick={loadMoreMessages}
                                disabled={isLoadingMore}
                            >
                                {isLoadingMore ? "Loading..." : "Load More Messages"}
                            </button>
                        )}
                        {chatHistory?.map((chat: Chat) => (
                            chat.sender_id === parsedUser.id ? (
                                <div key={chat.id} className="flex flex-col gap-1 items-start">
                                    <div className="bg-white max-w-[80%] text-gray-700 px-4 py-3 rounded-lg shadow-sm rounded-bl-none">
                                        {chat.message}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">{chat.created_at}</p>
                                </div>
                            ) : (
                                <div key={chat.id} className="flex flex-col gap-1 items-end">
                                    <div className="bg-primary text-xs max-w-[80%] text-white px-4 py-3 rounded-lg shadow-sm rounded-br-none">
                                        {chat.message}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 text-right">
                                        {chat.created_at}
                                    </p>
                                </div>
                            )
                        ))}
                        <div ref={chatEndRef}></div>
                    </>
                )}
            </main>

            {/* Message Input */}
            <footer>
                <form
                    className="flex items-center gap-2 px-4 py-3 border-t fixed bottom-0 w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        {...register("message", { required: true })}
                        className={"form-input"}
                        placeholder={"Write a message..."}
                    />
                    <Button
                        isDisabled={sendMessage.isPending}
                        type={"submit"}
                        isIconOnly
                        radius={"full"}
                        variant={"light"}
                    >
                        <SendIcon />
                    </Button>
                </form>
            </footer>
        </div>
    );
};

export default ChatPage;
