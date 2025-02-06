import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Location {
    latitude: number | null;
    longitude: number | null;
}

export interface User {
    id: number;
    name: string;
    job_title: string;
    industry: string;
    avatar: any;
    company_activity_type: any;
}

export default function useService() {
    const sendUserLocation = useMutation({
        mutationFn: async (body: Location) => {
            await createService("/v1/user/location", body);
        },
    });

    const getUnreadMessagesCount = () => useQuery({
        queryKey: ["/v1/chat/unread-messages-count"],
        queryFn: ({queryKey}) =>
            fetchService({
                url: queryKey.join(""),
            }),
        refetchOnMount: true,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    const fetchData = (url: string, searchKey: string) => {
        const params = new URLSearchParams();
        if (searchKey) {
            params.append("q", searchKey);
        }
        return fetchService({url: `${url}?${params.toString()}`});
    };

    const getIndustriesList = (value : any) => useQuery({
        queryKey: ["/v1/app/industries"],
        queryFn: () => fetchData("/v1/app/industries", value),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    const getJobTitlesList = (value : any) => useQuery({
        queryKey: ["/v1/app/job-titles"],
        queryFn: () => fetchData("/v1/app/job-titles", value),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    return {getUnreadMessagesCount, sendUserLocation, getIndustriesList, getJobTitlesList};
}
