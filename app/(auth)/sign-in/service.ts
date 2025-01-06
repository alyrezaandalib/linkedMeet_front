import {useQuery} from "@tanstack/react-query";

import {fetchService} from "@/services/crud-services/fetch-service";


export interface Inputs {
    email: string;
    password: string;
    keepLoggedIn: boolean;
}

export default function useService() {

    const getUserActivityType = () => useQuery({
        queryKey: ["/v1/user/company-activity-types"],
        queryFn: ({queryKey}) =>
            fetchService({
                url: queryKey.join(""),
            }),
    })

    return {getUserActivityType};
}
