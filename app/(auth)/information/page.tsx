"use client"
import {useEffect, useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";
import {Button} from "@nextui-org/react";
import useService, {Inputs} from "./service";
import SelectableModal from "@/components/selectableModal";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {UpdateIndustryAndJobTitle} from "@/store/userSlice";

type ItemType = {
    id: string;
    name: string;
};

export default function InformationPage() {
    const router = useRouter();
    const hasIndustry = useSelector((state: any) => state.user.user.industry);
    const hasJobTitle = useSelector((state: any) => state.user.user.job_title);

    // service
    const {getIndustriesList, getJobTitlesList, sendUserInformation,} = useService()

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList()
    const getJobTitlesListResponse = getJobTitlesList()

    const {
        register,
        handleSubmit,
        formState: {errors},
        setValue,
    } = useForm<Inputs>();

    const [selectedIndustry, setSelectedIndustry] = useState<ItemType | any>(null);
    const [selectedJob, setSelectedJob] = useState<ItemType | any>(null);

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);

    const sendUserInformationMutation = sendUserInformation


    const dispatch = useDispatch();

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        const updatedData = {
            ...data,
            industry_id: selectedIndustry?.id,
            job_title_id: selectedJob?.id,
        };
        sendUserInformation.mutate(updatedData, {
            onSuccess: () => {
                dispatch(UpdateIndustryAndJobTitle({industry: selectedIndustry.name, job_title: selectedJob.name}));
                router.push("/")
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    useEffect(() => {
        if (!!hasIndustry && !!hasJobTitle) router.push("/")
    }, [hasIndustry , hasJobTitle]);

    return (
        <div className="flex flex-col h-screen">
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[30%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[70%] justify-center">
                <div className="w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-2xl font-semibold text-black">Information</h2>
                        <p className="text-sm text-gray-400">Your profile will attract more people and discover many
                            different opportunities.</p>
                    </div>

                    {/* Form */}
                    <form className="flex flex-col gap-3 mt-5" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label
                                className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">Industry</label>
                            <input
                                {...register("industry_id", {required: "Industry is required."})}
                                readOnly
                                className="form-input"
                                value={selectedIndustry?.name || ""}
                                onClick={() => setIndustryModalOpen(true)} // Open Industry Modal
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
                                value={selectedJob?.name || ""}
                                onClick={() => setJobTitleModalOpen(true)} // Open Job Title Modal
                            />
                            {errors.job_title_id &&
                                <p className="text-red-500 text-xs mt-1">{errors.job_title_id.message}</p>}
                        </div>

                        <Button isLoading={sendUserInformationMutation.isPending} className="mt-10" color="primary"
                                radius="sm" type="submit">Ok</Button>
                    </form>
                </div>
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
                                setValue("industry_id", item.id);
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
                                setValue("job_title_id", item.id);
                                setJobTitleModalOpen(false);
                            }}
                        />

                    </>
                )
            }
        </div>
    );
}

