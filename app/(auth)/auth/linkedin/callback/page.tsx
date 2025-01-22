"use client"
import {Spinner} from "@heroui/react";
import {useRouter, useSearchParams} from "next/navigation";
import {useDispatch} from "react-redux";
import {Authentication} from "@/store/userSlice";
import toast from "react-hot-toast";
import {useMutation} from "@tanstack/react-query";
import {useEffect, useState} from "react";

export default function Page() {

    const router = useRouter();

    // get code from query
    const searchParams = useSearchParams()
    const [code, setCode] = useState<string | null>(searchParams.get("code"));

    const dispatch = useDispatch()

    const getUserInformationFromLinkedin = useMutation({
        mutationFn: async (code: string) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/linkedin/callback?code=${code}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
            }

            const data = await response.json();

            if (data?.token && data?.user) {
                dispatch(Authentication({
                    isAuthenticated: true,
                    token: data.token,
                    id : data.user.id,
                    name: data.user.name,
                    email: data.user.email,
                    avatar: data.user.avatar,
                    industry: data.user.industry,
                    job_title: data.user.job_title,
                    company_activity_types: data.user.company_activity_types,
                }));

                toast.success("Login successful!");
                return data;
            } else {
                throw new Error("Invalid response structure from server.");
            }
        },
        onError: (error) => {
            toast.error(error.message || "An error occurred during sign-in.");
            router.push("/sign-in");
        },
        onSuccess: (data) => {
            if (data.user.company_activity_types && data.user.company_activity_types.length === 0) {
                router.push("/activity-type")
            } else {
                router.push("/")
            }
        },
    });

    useEffect(() => {
        if (code) {
            getUserInformationFromLinkedin.mutate(code)
        } else {
            toast.error("Invalid or missing LinkedIn authorization code.");
            router.push("/sign-in");
        }
    }, [code]);

    return (
        <div className={"h-screen flex flex-col justify-center items-center gap-5 bg-white"}>
            <Spinner color={"primary"}/>
            <div className={"font-mono text-sm"}>Please wait a few moments.</div>
        </div>
    )
}
