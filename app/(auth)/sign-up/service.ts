import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    name: string;
    email: string;
    password: string;
}

export default function useService() {
    const signUpUser = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        signUpUser.mutate(data);
    };

    return {onSubmit, signUpUser};
}
