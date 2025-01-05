import {useMutation, useQuery} from "@tanstack/react-query";
import {updateService} from "@/services/crud-services/update-service";
import {fetchService} from "@/services/crud-services/fetch-service";

export interface Inputs {
    activity_type_ids: string[];
}

export default function useService() {

    const getCompanyActivityTypes = () => useQuery({
        queryKey: ["/v1/app/company-activity-types"],
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

    const sendUserActivityType = useMutation({
        mutationFn: async (body: Inputs) => {
            await updateService("/v1/user/company-activity-types", body);
        },
    });

    return {getCompanyActivityTypes, sendUserActivityType};
}
