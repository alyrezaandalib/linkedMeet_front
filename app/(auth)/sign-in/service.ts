import {useMutation, useQuery} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {Authentication} from "@/store/userSlice";
import {useDispatch} from "react-redux";
import {fetchService} from "@/services/crud-services/fetch-service";
import toast from "react-hot-toast";

export interface Inputs {
    email: string;
    password: string;
    keepLoggedIn: boolean;
}

export default function useService() {
    const dispatch = useDispatch();
    const signInUser = useMutation({
        mutationFn: async (body: Inputs) => {
            const response = await createService("/auth/login", body);
            if (response?.token && response?.user) {
                dispatch(Authentication({
                    isAuthenticated: true,
                    token: response.token,
                    name: response.user.name,
                    email: response.user.email,
                    avatar: response.user.avatar,
                    industry: response.user.industry,
                    job_title: response.user.job_title,
                    company_activity_types: response.user.company_activity_types,
                }));
            } else {
                toast.error(`Invalid response structure: ${response}`);
            }
        },
    });

    const linkedinRedirect = () => useQuery({
        queryKey: ["/auth/linkedin"],
        queryFn: ({queryKey}) =>
            fetchService({
                url: queryKey.join(""),
            }),
    })

    return {signInUser , linkedinRedirect};
}
