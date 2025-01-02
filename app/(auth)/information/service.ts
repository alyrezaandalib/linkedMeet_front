import {SubmitHandler} from "react-hook-form";
import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Inputs {
    industry: string;
    job_title: string;

}

export default function useService() {

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

    const sendUserInformation = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        sendUserInformation.mutate(data);
    };

    return {getIndustriesList, getJobTitlesList, onSubmit, sendUserInformation};
}
