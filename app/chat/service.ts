import {useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Chats {
    id: number
    name: string
    avatar : string
    started_at : string
    last_message_at : string
}

export default function useService() {

    const getChatsList = () => useQuery({
        queryKey: ["/v1/user/chats"],
        queryFn: ({queryKey, signal}) =>
            fetchService({url: queryKey.join("")}),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    });

    return {getChatsList};
}
