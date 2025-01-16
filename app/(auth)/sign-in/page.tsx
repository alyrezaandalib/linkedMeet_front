"use client"
import Linkedin from "@/public/tsx-icons/linkedin";
import Link from "next/link";
import {Button, Checkbox} from "@nextui-org/react";
import {useForm, Controller} from "react-hook-form";
import {useRouter} from "next/navigation";
import {useDispatch} from "react-redux";
import toast from "react-hot-toast";
import {useState} from "react";
import {Authentication} from "@/store/userSlice";

type Inputs = {
    email: string;
    password: string;
    keepLoggedIn: boolean;
};

export default function SignInPage() {

    const [isLoadingLogin, setIsLoadingLogin] = useState(false);
    const [isLoadingLinkedin, setIsLoadingLinkedin] = useState(false);
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>();

    const dispatch = useDispatch();

    const onSubmit = async (params: Inputs) => {
        setIsLoadingLogin(true);

        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            const data = await response.json();

            if (response.ok) {
                dispatch(Authentication({
                    isAuthenticated: true,
                    token: data.token,
                    id: data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    avatar: data.user.avatar,
                    industry: data.user.industry,
                    job_title: data.user.job_title,
                    company_activity_types: data.user.company_activity_types,
                }));

                toast.success("Login successful!");

                if (data.user.company_activity_types && data.user.company_activity_types.length === 0) {
                    router.push("/activity-type")
                } else {
                    router.push("/")
                }
            } else if (response.status === 403) {
                router.push(`/verify-code?email=${data.user.email}`, {});
            } else {
                toast.error(data.message || "An error occurred during sign-in.");
            }
        } catch (error) {
            toast.error("Invalid response structure from server.");
        } finally {
            setIsLoadingLogin(false);
        }
    };

    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[15%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[85%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-t-3xl max-w-[400px]"}></div>
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
                                autoComplete="email"
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
                                        value: 32,
                                        message: "Password must be at lest 32 characters long."
                                    }
                                })}
                                type="password"
                                autoComplete="current-password"
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


                        <p className="text-xs text-gray-400">“Sign in” instead of “Continue” “LinkedMeet” instead of “My
                            App”</p>

                        <Button color={"primary"} isLoading={isLoadingLogin} radius={"sm"} type={"submit"}>Sign
                            In</Button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* LinkedIn Login */}
                    <Button
                        isLoading={isLoadingLinkedin}
                        variant={"bordered"}
                        onPress={() => {
                            setIsLoadingLinkedin(true)
                            fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/linkedin`)
                                .then(response => {
                                    if (!response.ok) {
                                        toast.error(`HTTP error! status: ${response.status}`)
                                        throw new Error(`HTTP error! status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    setIsLoadingLinkedin(false)
                                    window.location.replace(data.url)
                                })
                                .catch(error => {
                                    toast.error(`Error fetching LinkedIn auth URL: ${error}`);
                                });
                        }}
                        className="py-6"
                    >
                        <Linkedin/>
                        <div className="text-sm text-gray-600">Linkedin</div>
                    </Button>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            New to LinkedMeet?
                        </p>
                        <Link href={"/sign-up"} className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Join now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
