"use client"
import {Button} from "@heroui/react";
import {useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@heroui/shared-icons";

type Inputs = {
    email: string;
    verification_code: string;
    password: string;
    password_confirmation: string;
};

export default function ChangePasswordPage() {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const router = useRouter();
    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<Inputs>();

    const onSubmit = async (params: Inputs) => {
        setIsLoadingLogin(true);

        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/reset-forgotten-password`, {
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
                router.push("/");
            } else {
                toast.error(data.message || "An error occurred during Reset Password.");
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
            <div className="text-center flex justify-center items-center text-3xl font-bold h-[15%] text-white">
                LinkedMeet
            </div>
            <div className="flex relative items-center h-[85%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-t-3xl max-w-[400px]"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Reset password</h2>
                        <p className="text-sm text-gray-400">
                            Please enter your email address and a new password to reset your account.
                            <br/>
                            <br/>
                            <strong>Note:</strong> After resetting, if the app is active on your phone, you will be
                            redirected to the app.
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

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Verification Code
                            </label>
                            <input
                                {...register("verification_code", {
                                    required: "Verification Code is required.",
                                    minLength: {
                                        value: 6,
                                        message: "Verification code must be 6 digits.",
                                    },
                                    maxLength: {
                                        value: 6,
                                        message: "Verification code must be 6 digits."
                                    }
                                })}
                                type="text"
                                className="form-input"
                                placeholder="6-digit code sent to your email"
                                autoComplete="off"
                            />
                            {errors.verification_code &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.verification_code.message}</p>}
                        </div>

                        <div className="relative">
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password", {
                                        required: "Password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters long.",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message: "Password must be at most 32 characters long."
                                        }
                                    })}
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    className="form-input w-full !pr-10"
                                    placeholder="At least 8 characters"
                                />
                                <button
                                    aria-label="toggle password visibility"
                                    className="absolute top-1/2 right-2 -translate-y-1/3 flex items-center focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                    )}
                                </button>
                            </div>
                            {errors.password &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-1 rtl:mr-2 text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                {...register("password_confirmation", {
                                    required: "Password confirmation is required.",
                                    validate: value => value === watch('password') || 'Passwords do not match',
                                    minLength: {
                                        value: 8,
                                        message: "Password confirmation must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 32,
                                        message: "Password confirmation must be at most 32 characters long."
                                    }
                                })}
                                type={isVisible ? "text" : "password"}
                                autoComplete="new-password"
                                className="form-input"
                                placeholder="At least 8 characters"
                            />
                            {errors.password_confirmation &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password_confirmation.message}</p>}
                        </div>

                        <Button className={"mt-4"} color={"primary"} isLoading={isLoadingLogin} radius={"sm"}
                                type={"submit"}>
                            Reset Password
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
