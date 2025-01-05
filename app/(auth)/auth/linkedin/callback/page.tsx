"use client"
import {Spinner} from "@nextui-org/react";
import {useRouter, useSearchParams} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {Authentication} from "@/store/userSlice";
import toast from "react-hot-toast";
import {useEffect} from "react";

export default function Page() {

    const isAuthenticated = useSelector((state: any) => state.user.isAuthenticated);
    const hasCompanyActivityTypes = useSelector((state: any) => JSON.parse(state.user.user.company_activity_types));
    const hasIndustry = useSelector((state: any) => state.user.user.industry);
    const hasJobTitle = useSelector((state: any) => state.user.user.job_title);

    // get code from query
    const searchParams = useSearchParams()
    const code = searchParams.get("code")

    const router = useRouter();
    const dispatch = useDispatch()

    const getUserInformationFromLinkedin = async (code: any) => {
        fetch(`/v1/auth/linkedin/callback?code=${code}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data?.token && data?.user) {
                    dispatch(Authentication({
                        isAuthenticated: true,
                        token: data.token,
                        name: data.user.name,
                        email: data.user.email,
                        avatar: data.user.avatar,
                        industry: data.user.industry,
                        job_title: data.user.job_title,
                        company_activity_types: data.user.company_activity_types,
                    }));

                    if (Array.isArray(hasCompanyActivityTypes) && hasCompanyActivityTypes.length === 0) router.push("/activity-type");
                    if (!hasIndustry && !hasJobTitle) router.push("/information");
                    router.push("/")
                } else {
                    toast.error(`Invalid data structure: ${data}`);
                    router.push("/sign-in")
                }
            })
            .catch(error => {
                toast.error(`Error fetching LinkedIn auth URL: ${error}`);
                router.push("/sign-in")
            });
    }

    useEffect(() => {
        if (code) {
            getUserInformationFromLinkedin(code)
        } else {
            toast.error("Invalid or missing LinkedIn authorization code.");
            router.push("/sign-in");
        }
    }, [code]);

    if (isAuthenticated) router.push("/");

    return (
        <div className={"h-screen flex flex-col justify-center items-center gap-5 bg-white"}>
            <Spinner color={"primary"}/>
            <div className={"font-mono text-sm"}>Please wait a few moments.</div>
        </div>
    )
}