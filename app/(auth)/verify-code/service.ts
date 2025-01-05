import {useMutation} from "@tanstack/react-query";
import {createService} from "@/services/crud-services/create-service";

export interface Inputs {
    verification_code: number;
    email: string;
}

export interface IResendVerificationCode {
    email: string;
}

export default function useService() {
    const verifyCode = useMutation({
        mutationFn: async (body: Inputs) => {
            await createService("/v1/auth/verify-email", body);
        },
    });

    const resendVerificationCode = useMutation({
        mutationFn: async (data: IResendVerificationCode) => {
            await createService("/v1/auth/resend-verification-code", data);
        }
    })

    return {verifyCode, resendVerificationCode};
}
