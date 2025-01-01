import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";
import {Authentication} from "@/store/userSlice";
import {useDispatch} from "react-redux";

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
                console.error("Invalid response structure:", response);
            }
        },
    });

    return {signInUser};
}
