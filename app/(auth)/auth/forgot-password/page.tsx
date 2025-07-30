"use client"
import Link from "next/link";
import {Button} from "@heroui/react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";

type Inputs = {
    email: string;
};

export default function ForgotPasswordPage() {

    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const router = useRouter();
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>();


    const onSubmit = async (params: Inputs) => {
        setIsLoadingLogin(true);

        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.message);
                router.push("/auth/reset-password");
            } else {
                toast.error(data.message || "An error occurred during forgot password.");
            }
        } catch (error) {
            toast.error("Invalid response structure from server.");
        } finally {
            setIsLoadingLogin(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/")
        }
    }, []);

    return (
        <div className={"flex flex-col h-screen"}>
            <div className="text-center flex justify-center items-center text-3xl font-bold h-[50%] text-white">
                LinkedMeet
            </div>
            <div className="flex relative items-center h-[50%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-t-3xl max-w-[400px]"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Forgot password</h2>
                        <p className="text-sm text-gray-400">
                            Please enter your email address. We'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"} onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Email
                            </label>
                            <input
                                {...register("email", {required: "Email is required."})}
                                type="email"
                                placeholder="e.g. example@email.com"
                                className="form-input"
                                autoComplete="email"
                            />
                            {errors.email && <p className={"text-red-500 text-xs mt-1"}>{errors.email.message}</p>}
                        </div>

                        <Button color={"primary"} isLoading={isLoadingLogin} radius={"sm"} type={"submit"}>
                            Send Reset Link
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            Go back to
                        </p>
                        <Link href={"/sign-in"} prefetch={false}
                              className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
