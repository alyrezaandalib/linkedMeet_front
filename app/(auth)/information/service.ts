import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";
import {patchService} from "@/services/crud-services/patch-service";

export interface Inputs {
    industry_id: string | number;
    job_title_id: string | number;

}

export default function useService() {

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

    const sendUserInformation = useMutation({
        mutationFn: async (body: Inputs) => {
            await patchService("/v1/user/information", body);
        },
    });

    return {getIndustriesList, getJobTitlesList, sendUserInformation};
}


