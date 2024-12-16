import { SubmitHandler } from "react-hook-form";
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
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        signInUser.mutate(data);
    };

    return { onSubmit, signInUser };
}
