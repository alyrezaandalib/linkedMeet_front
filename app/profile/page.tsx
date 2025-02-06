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
// icons
import {IoIosArrowBack} from "react-icons/io";

export default function ProfilePage() {

    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false);
    const [isChanged, setIsChanged] = useState(false); // اضافه کردن state برای تغییرات

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
                    setIsChanged(false); // بازنشانی state پس از ارسال اطلاعات
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        }
    };

    // چک کردن اینکه آیا تغییرات ایجاد شده است یا نه
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
                    <h1 className="ml-2 text-lg font-bold">Profile</h1>
                </div>
                <div className={"h-full flex flex-col mt-7"}>
                    <div className={"flex flex-col justify-center items-center gap-2"}>
                        <Avatar isBordered className="w-20 h-20 text-large" src={user.avatar} alt={user.name}/>
                        <div className={"font-mono capitalize"}>{user?.name}</div>
                        <div className={"flex gap-1"}>
                            <ImgUploader isLoading={isLoading} setImage={setImage}/>
                        </div>
                    </div>

                    <form className={"flex flex-col p-4 mt-7 h-[65%] justify-between"}
                          onSubmit={handleSubmit(onSubmit)}>
                        <div className={"flex flex-col gap-1.5"}>
                            <div>
                                <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                    Name
                                </label>
                                <input
                                    defaultValue={user?.name}
                                    {...register("name", {required: "Name is required."})}
                                    className="form-input"
                                    onChange={handleFieldChange} // فراخوانی متد handleFieldChange
                                />
                                {errors.name && <p className={"text-red-500 text-xs mt-1"}>{errors.name.message}</p>}
                            </div>
                            <div>
                                <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
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
                                    className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">Industry</label>
                                <input
                                    {...register("industry_id", {required: "Industry is required."})}
                                    readOnly
                                    className="form-input"
                                    value={selectedIndustry?.name || (user.industry === "null" ? "" : user.industry)}
                                    onClick={() => setIndustryModalOpen(true)}
                                    onChange={handleFieldChange} // فراخوانی متد handleFieldChange
                                />
                                {errors.industry_id &&
                                    <p className="text-red-500 text-xs mt-1">{errors.industry_id.message}</p>}
                            </div>

                            <div>
                                <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">Job
                                    Title</label>
                                <input
                                    {...register("job_title_id", {required: "Job title is required."})}
                                    readOnly
                                    className="form-input"
                                    value={selectedJob?.name || (user.job_title === "null" ? "" : user.job_title)}
                                    onClick={() => setJobTitleModalOpen(true)}
                                    onChange={handleFieldChange} // فراخوانی متد handleFieldChange
                                />
                                {errors.job_title_id &&
                                    <p className="text-red-500 text-xs mt-1">{errors.job_title_id.message}</p>}
                            </div>
                        </div>

                        <Button radius={"sm"}
                                color={"primary"}
                                type={"submit"}
                                isLoading={isPending}
                                isDisabled={!isChanged}> {/* دکمه Ok فقط در صورت تغییر فعال می‌شود */}
                            Save
                        </Button>
                    </form>
                </div>

                {
                    getIndustriesListResponse.data?.data && getJobTitlesListResponse.data?.data && (
                        <>
                            {/* Industry Modal */}
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
                    )
                }

            </div>
        )
    }
}
