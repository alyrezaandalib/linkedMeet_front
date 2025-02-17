"use client"
import Linkedin from "@/public/tsx-icons/linkedin";
import Link from "next/link";
import {Button} from "@heroui/button";
import useService, {Inputs} from "./service";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@heroui/shared-icons";

export default function SignUpPage() {

    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch
    } = useForm<Inputs>()

    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const router = useRouter();

    const {signUpUser} = useService();

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        signUpUser.mutate(data, {
            onSuccess: () => {
                setRedirectPath(`/verify-code?email=${data.email}`);
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const [redirectPath, setRedirectPath] = useState<string | null>(null);

    useEffect(() => {
        if (redirectPath) {
            router.push(redirectPath);
        }
    }, [redirectPath]);

    const {isPending} = signUpUser

    return (
        <div className={"flex flex-col h-screen overflow-y-scroll"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[10%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[90%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-t-3xl max-w-[400px]"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full overflow-y-auto h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Sign Up</h2>
                        <p className="text-sm text-gray-400">Nearby People, New Conversations</p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"} onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Name
                            </label>
                            <input
                                {...register("name", {required: "Name is required."})}
                                className="form-input"
                                placeholder="e.g. John Doe"
                            />
                            {errors.name && <p className={"text-red-500 text-xs mt-1"}>{errors.name.message}</p>}
                        </div>

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

                        <div className="relative">
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Password
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
                                            message: "Password must be at lest 32 characters long."
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
                                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            </div>
                            {errors.password &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                {...register("password_confirmation", {
                                    required: "Confirm password is required.",
                                    validate: value => value === watch('password') || 'Password do not match',
                                    minLength: {
                                        value: 8,
                                        message: "Confirm password must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 32,
                                        message: "Confirm password must be at lest 32 characters long."
                                    }
                                })}
                                type={isVisible ? "text" : "password"}
                                className="form-input"
                                autoComplete={"new-password"}
                                placeholder="At least 8 characters"
                            />
                            {errors.password_confirmation &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password_confirmation.message}</p>}
                        </div>
                        <p className="text-xs text-gray-400 max-w-[90%]">
                            By clicking Agree & Join, you agree to LinkedMeet User Agreement, Privacy Policy, and Cookie Policy.
                        </p>

                        <Button color={"primary"} isLoading={isPending} radius={"sm"} type={"submit"}>Agree &
                            Join</Button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <Button
                        isLoading={isLoading}
                        variant={"bordered"}
                        onPress={() => {
                            setIsLoading(true)
                            fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/linkedin`)
                                .then(response => {
                                    if (!response.ok) {
                                        toast.error(`HTTP error! status: ${response.status}`)
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    setIsLoading(false)
                                    window.location.replace(data.url)
                                })
                                .catch(error => {
                                    toast.error(`Error fetching LinkedIn auth URL: ${error}`);
                                });
                        }}
                        className="py-6"
                    >
                        <Linkedin/>
                        <div className="text-sm text-gray-600">LinkedIn</div>
                    </Button>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            Already on LinkedMeet?
                        </p>
                        <Link href={"/sign-in"} prefetch={false} className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
