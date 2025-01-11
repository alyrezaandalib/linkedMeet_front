import {useMutation, useQuery} from "@tanstack/react-query";
import {Inputs} from "@/app/profile/service";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Message {
    receiver_id: number
    message: string
}

export interface Chat {
    id: number
    "sender_id": number,
    "receiver_id": number
    "message": string
    "created_at": string
    "read_at": string
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

    const sendMessage = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/v1/chat/send-message", body);
        },
    });

    return {getChatHistory,sendMessage};
}
