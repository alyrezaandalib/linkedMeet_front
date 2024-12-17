import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    activity_types : string[];
}

export default function useService() {
    const sendUserActivityType = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/test", body);
        },
    });

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        console.log(data);
        sendUserActivityType.mutate(data);
    };

    return {onSubmit, sendUserActivityType};
}
