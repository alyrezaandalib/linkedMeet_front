import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Chats {
    id : number
    first_name: string
    last_name: string
    image: any
}

export default function useService() {

    const getChatsList = () => useQuery({
        queryKey: [""],
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
