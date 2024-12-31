import { useMutation } from "@tanstack/react-query";
import { createService } from "@/services/crud-services/create-service";

export interface Inputs {
    email: string;
    password: string;
    keepLoggedIn: boolean;
}

export default function useService() {
    const signInUser = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/auth/login", body);
        },
    });

    return { signInUser };
}
