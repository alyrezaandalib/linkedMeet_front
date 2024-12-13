import {SubmitHandler} from "react-hook-form";

export interface Inputs {
    otp: number;
};

export default function useService() {
    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => console.log(data)
    return {onSubmit};
}
