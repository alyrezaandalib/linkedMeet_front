import {useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";

export default function useService() {

    const getUserInformationFromLinkedin = (code) => useQuery({
        queryKey: [`/auth/linkedin/callback?${code}`],
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

    return {getUserInformationFromLinkedin}
}