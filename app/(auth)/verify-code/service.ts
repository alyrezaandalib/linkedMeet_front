import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    verification_code: number;
    email: string;
}

export default function useService() {
    const verifyCode = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/auth/verify-email", body);
        },
    });

    return { verifyCode};
}
