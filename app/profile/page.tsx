"use client"
import Link from "next/link";
import {Button, Spinner} from "@nextui-org/react";
import useService, {Inputs} from "./service";
import {SubmitHandler, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import SelectableModal from "@/components/selectableModal";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {UpdateProfile, UpdateUserAvatar} from "@/store/userSlice";
import ImgUploader from "@/components/img-uploader";
import {getCookie} from "cookies-next";
// icons
import {IoIosArrowBack} from "react-icons/io";


export default function ProfilePage() {

    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false);

    // service
    const {editUserInfo, getIndustriesList, getJobTitlesList} = useService();

    // img uploader
    const [image, setImage] = useState<any>(null);
    const onSubmitUserAvatar = (data: any) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${getCookie("token")}`);

        const formData = new FormData();
        formData.append("avatar", image);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: formData,
        };

        setIsLoading(true)

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/user/avatar`, requestOptions)
            .then(async (response) => {
                if (!response.ok) {
                    const errorData = await response.json();
                    if (errorData.errors) {
                        Object.values(errorData.errors).forEach((errorMessages) => {
                            (errorMessages as string[]).forEach((message) => {
                                toast.error(message);
                            });
                        });
                    }
                    throw new Error('There were validation errors.');
                }
                return response.json();
            })
            .then((data: any) => {
                toast.success(data.message)
                setIsLoading(false)
                dispatch(UpdateUserAvatar(data.avatar_url))
            })
            .catch((error) => {
                if (!error.message.includes('validation errors')) {
                    toast.error(error.message);
                }
                setIsLoading(false)
            });
    };

    useEffect(() => {
        if (image) {
            onSubmitUserAvatar(image)
        }
    }, [image]);

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList()
    const getJobTitlesListResponse = getJobTitlesList()

    const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {

        const industryId = getIndustriesListResponse.data?.data.find((item: any) => item?.name === user.industry)
        const job_titleId = getJobTitlesListResponse.data?.data.find((item: any) => item?.name === user.job_title)

        const updatedData = {
            ...data,
            industry_id: selectedIndustry?.id ?? industryId.id,
            job_title_id: selectedJob?.id ?? job_titleId.id,
        };

        if (updatedData.job_title_id && updatedData.industry_id) {
            editUserInfo.mutate(updatedData, {
                onSuccess: () => {
                    toast.success("profile successfully updated");
                    dispatch(UpdateProfile({
                        name: data?.name ?? "",
                        industry: selectedIndustry?.name ? selectedIndustry?.name : user.industry,
                        job_title: selectedJob?.name ? selectedJob?.name : user.job_title,
                    }));
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        }
    };

    const {isPending, isError, data} = editUserInfo


    useEffect(() => {
        if (user) {
            setIsLoaded(true);
        }
    }, [user]);

    if (!isLoaded) {
        return (
            <div className={"h-screen w-[100%] flex justify-center items-center gap-2 text-sm z-50"}>
                <Spinner size={"sm"}/>
                Loading...
            </div>
        );
    } else {
        return (
            <div className={"px-5 pt-4 h-screen flex flex-col"}>
                <div className="flex items-center">
                    <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                        <IoIosArrowBack className={"text-lg"}/>
                    </Link>
                    <h1 className="ml-2 text-lg font-bold">Edit Profile</h1>
                </div>
                <div className={"h-full flex flex-col mt-7"}>
                    <div className={"flex flex-col justify-center items-center gap-2"}>
                        <div className={"bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center"}>
                            <img className={"rounded-full h-full w-full bg-gray-200 border border-gray-300 !max-w-20 !max-h-20"} src={user.avatar}
                                 alt={user?.name}/>
                        </div>
                        <div className={"font-mono capitalize"}>{user?.name}</div>
                        <div className={"flex gap-1"}>
                            <ImgUploader isLoading={isLoading} setImage={setImage}/>
                        </div>
                    </div>

                    <form className={"flex flex-col p-4 mt-7 h-[65%] justify-between"}
                          onSubmit={handleSubmit(onSubmit)}>
                        <div className={"flex flex-col gap-1.5"}>
                            <div>
                                <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">
                                    Name
                                </label>
                                <input
                                    defaultValue={user?.name}
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
                                    value={user.email}
                                    readOnly
                                    className="form-input bg-gray-200/50"
                                />
                            </div>
                            <div>
                                <label
                                    className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">Industry</label>
                                <input
                                    {...register("industry_id", {required: "Industry is required."})}
                                    readOnly
                                    className="form-input"
                                    value={selectedIndustry?.name || (user.industry === "null" ? "" : user.industry)}
                                    onClick={() => setIndustryModalOpen(true)}
                                />
                                {errors.industry_id &&
                                    <p className="text-red-500 text-xs mt-1">{errors.industry_id.message}</p>}
                            </div>

                            <div>
                                <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">Job
                                    Title</label>
                                <input
                                    {...register("job_title_id", {required: "Job title is required."})}
                                    readOnly
                                    className="form-input"
                                    value={selectedJob?.name || (user.job_title === "null" ? "" : user.job_title)}
                                    onClick={() => setJobTitleModalOpen(true)}
                                />
                                {errors.job_title_id &&
                                    <p className="text-red-500 text-xs mt-1">{errors.job_title_id.message}</p>}
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

                {
                    getIndustriesListResponse.data?.data && getJobTitlesListResponse.data?.data && (
                        <>
                            {/* Industry Modal */}
                            <SelectableModal
                                title="Industry"
                                items={getIndustriesListResponse.data?.data || []}
                                selectedItem={selectedIndustry}
                                isOpen={isIndustryModalOpen}
                                onClose={() => setIndustryModalOpen(false)}
                                onSelect={(item: any) => {
                                    setSelectedIndustry(item);
                                    setIndustryModalOpen(false);
                                }}
                            />

                            <SelectableModal
                                title="Job Title"
                                items={getJobTitlesListResponse.data?.data || []}
                                selectedItem={selectedJob}
                                isOpen={isJobTitleModalOpen}
                                onClose={() => setJobTitleModalOpen(false)}
                                onSelect={(item: any) => {
                                    setSelectedJob(item);
                                    setJobTitleModalOpen(false);
                                }}
                            />

                        </>
                    )
                }

            </div>
        )
    }
}
