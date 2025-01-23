"use client";

import {InputOtp} from "@heroui/react";
import {Button} from "@heroui/button";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import useService, {Inputs} from "./service";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useState} from "react";
import Counter from "@/services/counter";
import toast from "react-hot-toast";

export default function VerifyCodePage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email")

    const router = useRouter();
    const [resendSMS, setResendSMS] = useState<number | null>(null);
    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    const {
        handleSubmit,
        resetField,
        control,
        formState: {errors},
        reset,
    } = useForm<Inputs>();

    const {verifyCode, resendVerificationCode} = useService();

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        if (email) {
            data.email = email;
        }

        verifyCode.mutate(data, {
            onSuccess: (response) => {
                reset();
                toast.success("Email verified successfully.");
                setRedirectPath('/sign-in')
            },
            onError: (error) => {
                toast.error(error.message)
            },
        });
    };

    useEffect(() => {
        if (redirectPath) {
            router.push(redirectPath);
        }
    }, [redirectPath]);

    return (
        <div className="flex flex-col h-screen">
            <div className="text-center flex justify-center items-center text-3xl font-bold h-[30%] text-white">
                LinkedMeet
            </div>
            <div className="flex relative items-center h-[70%] justify-center">
                <div className="w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-t-3xl max-w-[400px]"></div>
                <div
                    className="absolute flex flex-col bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-2xl font-semibold text-black">Code Sent</h2>
                        <div className="text-sm text-gray-400">
                            We have sent a 6-digit code to your email{" "}
                            <span className="text-black/80">{email || "No email provided"}</span>
                            <div> Please enter the code sent</div>
                        </div>
                    </div>

                    <form className="flex flex-col gap-4 items-center" onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col w-fit gap-2 pt-7 pb-12">
                            <Controller
                                name="verification_code"
                                control={control}
                                rules={{required: "OTP is required"}}
                                render={({field: {onChange, onBlur, ref}, fieldState: {error}}) => (
                                    <div>
                                        <InputOtp
                                            onChange={onChange}
                                            onBlur={onBlur}
                                            ref={ref}
                                            length={6}
                                            size="lg"
                                            variant="bordered"
                                        />
                                        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
                                    </div>
                                )}
                            />

                            <div className="text-gray-400 text-sm w-full flex justify-between">
                                Resend the code:
                                <div className="text-neutral text-[14px] mb-8">
                                    {resendSMS === 0 ? (
                                        <button
                                            type={"button"}
                                            onClick={() => {
                                                if (email) {
                                                    resendVerificationCode.mutate(
                                                        {email: email},
                                                        {
                                                            onSuccess: () => {
                                                                toast.success("verification code sent successfully.");
                                                                resetField("verification_code");
                                                                setResendSMS(null);
                                                            },
                                                            onError: (error) => {
                                                                toast.error(error.message)
                                                            },
                                                        }
                                                    );
                                                }
                                            }}
                                            className="cursor-pointer underline text-black/70"
                                        >
                                            Receive verification code again
                                        </button>
                                    ) : (
                                        <div className="text-right text-[13px] flex items-center">
                                            <span className="ml-1">
                                                <Counter setResendSMS={setResendSMS}/>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button color="primary" isLoading={verifyCode.isPending} radius="sm" type="submit"
                                className="w-full">
                            Ok
                        </Button>
                        <Button
                            color="primary"
                            onPress={() => router.push("/sign-up")}
                            variant="bordered"
                            radius="sm"
                            className="w-full"
                        >
                            Edit Email
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
