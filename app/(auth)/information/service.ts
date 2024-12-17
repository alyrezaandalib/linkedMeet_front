import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    industry: string;
    job_title: string;

}

export default function useService() {
    const sendUserInformation = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        sendUserInformation.mutate(data);
    };

    return {onSubmit, sendUserInformation};
}
