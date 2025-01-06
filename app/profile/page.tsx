"use client"
import Link from "next/link";
import {Button} from "@nextui-org/button";
import useService, {Inputs} from "./service";
import {SubmitHandler, useForm} from "react-hook-form";
// icons
import {IoIosArrowBack} from "react-icons/io";
import {useDispatch, useSelector} from "react-redux";
import SelectableModal from "@/components/selectableModal";
import {useState} from "react";
import toast from "react-hot-toast";
import {UpdateProfile} from "@/store/userSlice";

type ItemType = {
    id: string;
    name: string;
};

export default function ProfilePage() {

    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();

    // service
    const {editUserInfo, getIndustriesList, getJobTitlesList} = useService();

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList()
    const getJobTitlesListResponse = getJobTitlesList()

    const [selectedIndustry, setSelectedIndustry] = useState<ItemType | any>(null);
    const [selectedJob, setSelectedJob] = useState<ItemType | any>(null);

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        const updatedData = {
            ...data,
            industry_id: selectedIndustry?.id,
            job_title_id: selectedJob?.id,
        };
        editUserInfo.mutate(updatedData, {
            onSuccess: () => {
                dispatch(UpdateProfile({
                    name: data.name,
                    industry: selectedIndustry.name ?? user.industry,
                    job_title: selectedJob.name ?? user.job_title,
                }));
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    const {isPending, isError, data} = editUserInfo

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
                    <div className={"bg-gray-200 rounded-full w-20 h-20"}>
                        <img className={"border-none rounded-full"} src={user.avatar} alt={user.name} width={90} height={90}/>
                    </div>
                    <div className={"font-mono capitalize"}>{user.name}</div>
                    <div className={"flex gap-1"}>
                        <input type={"file"}/>
                        {/*<Button radius={"full"}>Upload new picture</Button>*/}
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
                                value={user.name}
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