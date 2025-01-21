import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface IMessage {
    receiver_id: number
    message: string
}

export interface IChat {
    id: number
    "sender_id": number,
    "receiver_id": number
    "message": string
    "created_at": string
    "read_at": string
}

export interface IMarkAsRead {
    sender_id: number
}


export default function useService() {

    const getChatHistory = (partner_id: any, page: any) => useQuery({
        queryKey: [`/v1/chat/history?partner_id=${partner_id}&page=${page}`],
        queryFn: ({queryKey, signal}) =>
            fetchService({url: queryKey.join("")}),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });

    const markAsRead = useMutation({
        mutationFn: async (body: IMarkAsRead) => {
            await createService("/v1/chat/mark-as-read", body);
        },
    });

    const sendMessage = useMutation({
        mutationFn: async (body: any) => {
            await createService("/v1/chat/send-message", body);
        },
    });

    return {getChatHistory, sendMessage, markAsRead};
}
