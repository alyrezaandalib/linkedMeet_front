import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Location {
    latitude: number | null;
    longitude: number | null;
}

export interface User {
    first_name: string;
    last_name: string;
    job_title: string;
    industry: string;
    image : any
}

export default function useService() {
    const sendUserLocation = useMutation({
        mutationFn: async (body: Location) => {
            await createService("/user/location", body);
        },
    });

    const getNearbyUsers =() => useQuery({
        queryKey: ["/user/nearby-users"],
        queryFn: ({queryKey, signal}) =>
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

    const getIndustriesList = () => useQuery({
        queryKey: ["/app/industries"],
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
        queryKey: ["/app/job-titles"],
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

    return {sendUserLocation , getNearbyUsers , getIndustriesList , getJobTitlesList};
}