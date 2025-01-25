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

    const getIndustriesList = () => useQuery({
        queryKey: ["/v1/app/industries"],
        queryFn: ({queryKey}) =>
            fetchService({
                url: queryKey.join(""),
            }),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    const getJobTitlesList = () => useQuery({
        queryKey: ["/v1/app/job-titles"],
        queryFn: ({queryKey}) =>
            fetchService({
                url: queryKey.join(""),
            }),
        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: true,
    })

    return {getUnreadMessagesCount, sendUserLocation, getIndustriesList, getJobTitlesList};
}
