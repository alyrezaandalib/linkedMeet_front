"use client"
import {InputOtp} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
import {Controller, useForm} from "react-hook-form";
import useService, {Inputs} from "./service"
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Counter from "@/services/counter";

export default function VerifyCodePage() {

    const {onSubmit, verifyCode} = useService()
    const {
        register,
        handleSubmit,
        resetField,
        control,
        formState: {errors},
    } = useForm<Inputs>()

    const {data, isError, isPending} = verifyCode

    const router = useRouter()
    const pathname = usePathname()

    const [resendSMS, setResendSMS] : any = useState();

    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[30%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[70%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}></div>
                <div
                    className="absolute flex flex-col bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Code Sent</h2>
                        <div className="text-sm text-gray-400">
                            We have sent a 6-digit code to your email <span
                            className={"text-black/80"}>mehranwashere@gmail.com </span>
                            <div> please enter the code sent</div>
                        </div>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-4 items-center"} onSubmit={handleSubmit(onSubmit)}>
                        <div className={"flex flex-col w-fit gap-2 pt-7 pb-12"}>
                            <Controller
                                name="otp"
                                control={control}
                                render={({field: {onChange, onBlur, ref}}) => (
                                    <InputOtp
                                        onChange={onChange}
                                        onBlur={onBlur}
                                        ref={ref}
                                        length={6}
                                        size={"lg"}
                                        variant={"bordered"}
                                    />
                                )}
                            />

                            <div className={"text-gray-400 text-sm w-full flex justify-between"}>
                                Resend the code:
                                <div className={"text-neutral text-[14px] mb-8"}>
                                    {resendSMS === 0 ? (
                                        <button
                                            onClick={() => {
                                                resetField("otp");
                                                setResendSMS(null);
                                            }}
                                            className={"cursor-pointer"}
                                        >
                                            Receive verification code again
                                        </button>
                                    ) : (
                                        <div className={"text-right text-[13px] flex items-center"}>
                                            <span className={"ml-1"}><Counter setResendSMS={setResendSMS}/></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button color={"primary"} isLoading={isPending} radius={"sm"} type={"submit"}
                                className={"w-full"}>Ok</Button>
                        <Button color={"primary"} onPress={() => router.push("/sign-in")} variant={"bordered"}
                                radius={"sm"} className={"w-full"}>Edit
                            Email</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}