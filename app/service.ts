import {SubmitHandler} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Location {
    latitude: string;
    longitude: string;
}

export interface User {
    first_name: string;
    last_name: string;
    job_title: string;
    industry: string;
    image : any
}

export default function useService() {
    const sendUserLocation = useMutation({
        mutationFn: async (body: Location) => {
            await createService("/test", body);
        },
    });

    const onSubmitLocation: SubmitHandler<Location> = (data: Location) => {
        console.log(data);
        sendUserLocation.mutate(data);
    };

    return {onSubmitLocation, sendUserLocation};
}