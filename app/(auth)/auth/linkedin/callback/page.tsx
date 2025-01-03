"use client"

import {Spinner} from "@nextui-org/react";
import {useRouter, useSearchParams} from "next/navigation";
import useService from "./service";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {Authentication} from "@/store/userSlice";
import toast from "react-hot-toast";

export default function Page() {

    // get code from query
    const searchParams = useSearchParams()
    const code = searchParams.get("code")

    // service
    const {getUserInformationFromLinkedin} = useService()

    const router = useRouter();
    const dispatch = useDispatch()
    const {data} = getUserInformationFromLinkedin(code)
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
        router.push("/sign-in")
    } else {
        toast.error(`Invalid data structure: ${data}`);
    }

    return (
        <div className={"h-screen flex flex-col justify-center items-center gap-5 bg-white"}>
            <Spinner color={"primary"}/>
            <div className={"font-mono text-sm"}>Please wait a few moments.</div>
        </div>
    )
}