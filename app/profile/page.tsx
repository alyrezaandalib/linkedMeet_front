"use client"
import Link from "next/link";
import {Button, Spinner, Avatar} from "@heroui/react";
import useService, {Inputs} from "./service";
import {SubmitHandler, useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import SelectableModal from "@/components/selectableModal";
import React, {useEffect, useState} from "react";
import toast from "react-hot-toast";
import {UpdateProfile, UpdateUserAvatar} from "@/store/userSlice";
import ImgUploader from "@/components/img-uploader";
import {getCookie} from "cookies-next";
import {useRouter} from "next/navigation";
// icons
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import { IoPerson, IoMail, IoBriefcase, IoBusiness } from "react-icons/io5";

export default function ProfilePage() {
    const router = useRouter();
    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false);
    const [isChanged, setIsChanged] = useState(false);

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

    const [modalsSearchInput, setModalsSearchInput] = useState<any>({
        job_title: "",
        industry: ""
    })

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList(modalsSearchInput.industry)
    const getJobTitlesListResponse = getJobTitlesList(modalsSearchInput.job_title)

    useEffect(() => {
        setTimeout(() => {
            getIndustriesListResponse.refetch()
        }, 500)
    }, [modalsSearchInput?.industry])

    useEffect(() => {
        setTimeout(() => {
            getJobTitlesListResponse.refetch()
        }, 500)
    }, [modalsSearchInput?.job_title])

    // selected industry and selected job_title
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
                    setIsChanged(false);
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        }
    };

    const handleFieldChange = () => {
        setIsChanged(true);
    };

    const {isPending, isError, data} = editUserInfo

    useEffect(() => {
        if (user) {
            setIsLoaded(true);
        }
    }, [user]);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
                <div className="flex items-center gap-2 text-sm">
                    <Spinner size="sm"/>
                    Loading...
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="px-5 pt-4">
                    <div className="flex items-center mb-6">
                        <div
                            onClick={() => router.back()}
                            className="rounded-xl bg-white shadow-lg p-3 hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            <IoIosArrowBack className="text-xl text-gray-700" />
                        </div>
                        <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Profile
                        </h1>
                    </div>
                </div>

                <div className="flex justify-center items-start px-5">
                    <div className="w-full max-w-md px-3">

                        {/* Avatar Section */}
                        <div className="flex items-center space-x-4 py-8">
                            <div className="relative">
                                <Avatar
                                    isBordered
                                    className="w-24 h-24 text-large"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <div className="absolute -bottom-1 -right-1">
                                    <ImgUploader isLoading={isLoading} setImage={setImage}/>
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-800 text-lg capitalize">{user?.name}</h3>
                                <button
                                    onClick={() => router.push("/change-password")}
                                    className="text-blue-600 text-sm hover:text-blue-700 transition-colors duration-200"
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>

                        {/* Form Section */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-4 py-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                        <IoPerson className="mr-2 text-gray-500"/>
                                        Name
                                    </label>
                                    <input
                                        defaultValue={user?.name}
                                        {...register("name", {required: "Name is required."})}
                                        onChange={handleFieldChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                        placeholder="Enter your name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                        <IoMail className="mr-2 text-gray-500"/>
                                        Email
                                    </label>
                                    <input
                                        value={user.email}
                                        readOnly
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                        <IoBusiness className="mr-2 text-gray-500"/>
                                        Industry
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("industry_id", {required: "Industry is required."})}
                                            readOnly
                                            value={selectedIndustry?.name || (user.industry === "null" ? "" : user.industry)}
                                            onClick={() => setIndustryModalOpen(true)}
                                            onChange={handleFieldChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-10 cursor-pointer"
                                            placeholder="Select your industry"
                                        />
                                        <IoIosArrowForward
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                    </div>
                                    {errors.industry_id && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                            {errors.industry_id.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 flex items-center mb-2">
                                        <IoBriefcase className="mr-2 text-gray-500"/>
                                        Job Title
                                    </label>
                                    <div className="relative">
                                        <input
                                            {...register("job_title_id", {required: "Job title is required."})}
                                            readOnly
                                            value={selectedJob?.name || (user.job_title === "null" ? "" : user.job_title)}
                                            onClick={() => setJobTitleModalOpen(true)}
                                            onChange={handleFieldChange}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-10 cursor-pointer"
                                            placeholder="Select your job title"
                                        />
                                        <IoIosArrowForward
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                                    </div>
                                    {errors.job_title_id && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                            {errors.job_title_id.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                isLoading={isPending}
                                isDisabled={!isChanged}
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                size="lg"
                            >
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </form>

                        <div className="mt-6 mb-2 text-center">
                            <p className="text-xs text-gray-400">
                                Your profile information is secure and private
                            </p>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {getIndustriesListResponse.data?.data && getJobTitlesListResponse.data?.data && (
                    <>
                        <SelectableModal
                            title="Industry"
                            handleSearch={(searchValue: string) => setModalsSearchInput({
                                ...modalsSearchInput,
                                industry: searchValue
                            })}
                            items={getIndustriesListResponse.data?.data || []}
                            selectedItem={selectedIndustry}
                            isOpen={isIndustryModalOpen}
                            onClose={() => {
                                setIndustryModalOpen(false)
                                setModalsSearchInput({
                                    ...modalsSearchInput,
                                    industry: ""
                                })
                            }}
                            onSelect={(item: any) => {
                                setSelectedIndustry(item);
                                setModalsSearchInput({
                                    ...modalsSearchInput,
                                    industry: ""
                                })
                                setIndustryModalOpen(false);
                                setIsChanged(true);
                            }}
                        />

                        <SelectableModal
                            title="Job Title"
                            handleSearch={(searchValue: string) => setModalsSearchInput({
                                ...modalsSearchInput,
                                job_title: searchValue
                            })}
                            items={getJobTitlesListResponse.data?.data || []}
                            selectedItem={selectedJob}
                            isOpen={isJobTitleModalOpen}
                            onClose={() => {
                                setJobTitleModalOpen(false)
                                setModalsSearchInput({
                                    ...modalsSearchInput,
                                    job_title: ""
                                })
                            }}
                            onSelect={(item: any) => {
                                setSelectedJob(item);
                                setModalsSearchInput({
                                    ...modalsSearchInput,
                                    job_title: ""
                                })
                                setJobTitleModalOpen(false);
                                setIsChanged(true);
                            }}
                        />
                    </>
                )}
            </div>
        )
    }
}
