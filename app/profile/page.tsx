"use client"
import Link from "next/link";
import {Button} from "@nextui-org/button";
import useService, {Inputs} from "./service";
import {useForm} from "react-hook-form";
// icons
import {IoIosArrowBack} from "react-icons/io";


export default function ProfilePage() {

    const {onSubmit, editUserInfo} = useService();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const {isPending, isError, data} = editUserInfo

    return (
        <div className={"px-2 pt-4 h-screen flex flex-col"}>
            <div className="flex items-center px-3">
                <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </Link>
                <h1 className="ml-2 text-lg font-bold">Edit Profile</h1>
            </div>
            <div className={"h-full flex flex-col mt-7"}>
                <div className={"flex flex-col justify-center items-center gap-2"}>
                    <div className={"w-24 h-24 bg-gray-200 shadow rounded-full"}></div>
                    <div className={"font-mono"}>Alireza Andalib</div>
                    <div className={"flex gap-1"}>
                        <Button radius={"full"}>Upload new picture</Button>
                        <Button radius={"full"}>Delete</Button>
                    </div>
                </div>

                <form className={"flex flex-col p-4 mt-7 h-[65%] justify-between"} onSubmit={handleSubmit(onSubmit)}>
                    <div className={"flex flex-col gap-1.5"}>
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
                                className="form-input"
                            />
                            {errors.email && <p className={"text-red-500 text-xs mt-1"}>{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Job Title
                            </label>
                            <input
                                {...register("job_title", {required: "Job Title is required."})}
                                className="form-input"
                            />
                            {errors.job_title &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.job_title.message}</p>}
                        </div>
                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Industry
                            </label>
                            <input
                                {...register("industry", {required: "Industry is required."})}
                                className="form-input"
                            />
                            {errors.industry &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.industry.message}</p>}
                        </div>
                    </div>

                    <Button radius={"sm"}
                            color={"primary"}
                            type={"submit"}
                            isLoading={isPending}>
                        Ok
                    </Button>
                </form>
            </div>
        </div>
    )
}