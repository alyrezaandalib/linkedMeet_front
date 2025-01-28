import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export default function useService() {
    const signUpUser = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/v1/auth/register", body);
        },
    });



    return { signUpUser};
}
