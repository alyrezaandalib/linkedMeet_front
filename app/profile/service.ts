import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    name: string;
    email: string;
    job_title: string;
    industry: string;
}

export default function useService() {
    const editUserInfo = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        editUserInfo.mutate(data);
    };

    return {onSubmit, editUserInfo};
}
