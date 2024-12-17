"use client"

import {Button} from "@nextui-org/react";
import {useForm} from "react-hook-form";
import useService, {Inputs} from "./service";


export default function InformationPage() {

    const {onSubmit, sendUserInformation} = useService();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const {isPending , isError , data} = sendUserInformation

    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[30%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[70%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Information</h2>
                        <p className="text-sm text-gray-400">Your profile will attract more people and discover many different opportunities.</p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3 mt-5"} onSubmit={handleSubmit(onSubmit)}>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Industry
                            </label>
                            <input
                                {...register("industry", {required: "Industry is required."})}
                                className="form-input"
                            />
                            {errors.industry && <p className={"text-red-500 text-xs mt-1"}>{errors.industry.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                Job Title
                            </label>
                            <input
                                {...register("job_title", {
                                    required: "Job title is required.",
                                })}
                                type="password"
                                className="form-input"
                            />
                            {errors.job_title &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.job_title.message}</p>}
                        </div>

                        <Button className={"mt-10"} isLoading={isPending} color={"primary"} radius={"sm"} type={"submit"}>Ok</Button>
                    </form>
                </div>
            </div>
        </div>
    )
}