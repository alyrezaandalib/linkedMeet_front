import {SubmitHandler} from "react-hook-form";

export interface Inputs {
    name: string;
    email: string;
    password: string;
};

export default function useService() {
    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => console.log(data)
    return {onSubmit};
}
