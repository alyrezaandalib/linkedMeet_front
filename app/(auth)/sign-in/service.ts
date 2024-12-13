import {SubmitHandler} from "react-hook-form";

export interface Inputs {
    email: string;
    password: string;
    keepLoggedIn: boolean;
};

export default function useService() {
    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => console.log(data)
    return {onSubmit};
}
