import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";
import {patchService} from "@/services/crud-services/patch-service";

export interface Inputs {
    industry_id: string | number;
    job_title_id: string | number;

}

export default function useService() {

    const getIndustriesList = () => useQuery({
        queryKey: ["v1/app/industries"],
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

    const sendUserInformation = useMutation({
        mutationFn: async (body: Inputs) => {
            await patchService("/v1/user/information", body);
        },
    });

    return {getIndustriesList, getJobTitlesList, sendUserInformation};
}
