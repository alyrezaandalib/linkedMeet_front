"use client"
import Linkedin from "@/public/tsx-icons/linkedin";
import Link from "next/link";
import {Button, Checkbox} from "@nextui-org/react";
import {useForm, Controller, SubmitHandler} from "react-hook-form";
import useService, {Inputs} from "./service";
import {useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";


export default function SignInPage() {

    const router = useRouter();
    const {signInUser, linkedinRedirect} = useService()

    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
    const hasCompanyActivityTypes = useSelector((state: any) => state.user.user.company_activity_types);
    const hasIndustry = useSelector((state: any) => state.user.user.industry);
    const hasJobTitle = useSelector((state: any) => state.user.user.job_title);

    const {
        register,
        handleSubmit,
        control,
        formState: {errors},
        reset
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        signInUser.mutate(data, {
            onSuccess: () => {
                if (!hasCompanyActivityTypes) router.push("/activity-type");
                if (!hasIndustry && !hasJobTitle) router.push("/information");
                reset()
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

    const {isPending} = signInUser

    if (isAuthenticated) router.push("/");

    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[15%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[85%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Sign In</h2>
                        <p className="text-sm text-gray-400">Nearby People, New Conversations</p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"} onSubmit={handleSubmit(onSubmit)}>

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

                        <Controller
                            name="keepLoggedIn"
                            control={control}
                            render={({field: {onChange, onBlur, value, ref}}) => (
                                <Checkbox
                                    isSelected={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    ref={ref}
                                    radius={"sm"}
                                    classNames={{label: "font- text-sm"}}
                                >
                                    Keep me logged in
                                </Checkbox>
                            )}
                        />


                        <p className="text-xs text-gray-400">By clicking Continue, you agree to MYAPP User
                            Agreement, Privacy Policy, and Cookie Policy.</p>

                        <Button color={"primary"} isLoading={isPending} radius={"sm"} type={"submit"}>Sign In</Button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* LinkedIn Login */}
                    <button
                        onClick={() => {
                            fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/auth/linkedin`)
                                .then(response => {
                                    if (!response.ok) {
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
                        <div className="text-sm text-gray-600">Linkedin</div>
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            Dont Have Account?
                        </p>
                        <Link href={"/sign-up"} className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}