"use client"
import Linkedin from "@/public/tsx-icons/linkedin";
import Link from "next/link";
import {Button} from "@nextui-org/button";
import useService, {Inputs} from "./service";
import {SubmitHandler, useForm} from "react-hook-form";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useSelector} from "react-redux";

export default function SignUpPage() {

    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm<Inputs>()

    const router = useRouter();

    const {signUpUser} = useService();

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        signUpUser.mutate(data, {
            onSuccess: () => {
                router.push(`/verify-code?email=${data.email}`);
                reset()
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const {isPending} = signUpUser

    if (isAuthenticated) router.push("/");

    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[10%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[90%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Sign Up</h2>
                        <p className="text-sm text-gray-400">Nearby People, New Conversations</p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"} onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Name
                            </label>
                            <input
                                {...register("name", {required: "Name is required."})}
                                className="form-input"
                            />
                            {errors.name && <p className={"text-red-500 text-xs mt-1"}>{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Email
                            </label>
                            <input
                                {...register("email", {required: "Email is required."})}
                                type="email"
                                placeholder="test@gmail.com"
                                className="form-input"
                            />
                            {errors.email && <p className={"text-red-500 text-xs mt-1"}>{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Password
                            </label>
                            <input
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Password must be at lest 10 characters long."
                                    }
                                })}
                                type="password"
                                className="form-input"
                            />
                            {errors.password &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password.message}</p>}
                        </div>

                        <p className="text-xs text-gray-400 max-w-[90%]">By clicking Agree & Join or Continue, you agree
                            to the
                            LinkedIn User Agreement, Privacy Policy, and Cookie Policy.</p>

                        <Button color={"primary"} isLoading={isPending} radius={"sm"} type={"submit"}>Agree &
                            Join</Button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <button
                        onClick={() => {
                            fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/linkedin`)
                                .then(response => {
                                    if (!response.ok) {
                                        toast.error(`HTTP error! status: ${response.status}`)
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    window.location.replace(data.url)
                                })
                                .catch(error => {
                                    toast.error(`Error fetching LinkedIn auth URL: ${error}`);
                                });
                        }}
                        className="w-full flex items-center justify-center gap-1.5 border border-gray-300 py-4 px-4 rounded-lg hover:bg-gray-100"
                    >
                        <Linkedin/>
                        <div className="text-sm text-gray-600"> Linkedin</div>
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            Already on LinkedIn? Sign in ?
                        </p>
                        <Link href={"/sign-in"} className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}