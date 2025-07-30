import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchService } from "@/services/crud-services/fetch-service";
import { patchService } from "@/services/crud-services/patch-service";

export interface Inputs {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function useService() {
    const changePassword = useMutation({
        mutationFn: async (body: Inputs) => {
            await patchService("/v1/auth/change-password", body);
        },
    });

    return { changePassword };
}