"use client"
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Modal, ModalContent, ModalHeader, ModalBody, Button} from "@nextui-org/react";
import useService, {Inputs} from "./service";
import {IoMdCheckmark} from "react-icons/io";

const jobTitles = ["Research Skills", "Analyst", "Legal Research", "Oil And Gas", "Sales Operations", "Sales Management", "Social Media"];
const industries = ["Technology", "Finance", "Healthcare", "Education", "Retail", "Energy"];

export default function InformationPage() {
    // service
    const {getIndustriesList, getJobTitlesList, sendUserInformation, onSubmit,} = useService()

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList()
    const getJobTitlesListResponse = getJobTitlesList()

    useEffect(() => {
        console.log(getIndustriesListResponse.data?.data)
    }, [getIndustriesListResponse]);

    const {
        register,
        handleSubmit,
        formState: {errors}
    } = useForm<Inputs>();

    const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);


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
                                {...register("industry", {required: "Industry is required."})}
                                readOnly
                                className="form-input"
                                value={selectedIndustry.name|| ""}
                                onClick={() => setIndustryModalOpen(true)} // Open Industry Modal
                            />
                            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700">Job
                                Title</label>
                            <input
                                {...register("job_title", {required: "Job title is required."})}
                                readOnly
                                className="form-input"
                                value={selectedJob.name || ""}
                                onClick={() => setJobTitleModalOpen(true)} // Open Job Title Modal
                            />
                            {errors.job_title &&
                                <p className="text-red-500 text-xs mt-1">{errors.job_title.message}</p>}
                        </div>

                        <Button className="mt-10" color="primary" radius="sm" type="submit">Ok</Button>
                    </form>
                </div>
            </div>

            {/* Industry Modal */}
            {
                getIndustriesListResponse.data?.data && (
                    <>
                        <SelectableModal
                            title="Industry"
                            items={getIndustriesListResponse.data?.data || []}
                            selectedItem={selectedIndustry}
                            isOpen={isIndustryModalOpen}
                            onClose={() => setIndustryModalOpen(false)}
                            onSelect={(item) => {
                                setSelectedIndustry(item);
                                setIndustryModalOpen(false);
                            }}
                        />

                        {/* Job Title Modal */}
                        <SelectableModal
                            title="Job Title"
                            items={getJobTitlesListResponse.data?.data || []}
                            selectedItem={selectedJob}
                            isOpen={isJobTitleModalOpen}
                            onClose={() => setJobTitleModalOpen(false)}
                            onSelect={(item) => {
                                setSelectedJob(item);
                                setJobTitleModalOpen(false);
                            }}
                        />
                    </>
                )
            }
        </div>
    );
}

interface SelectableModalProps {
    title: string;
    items: string[];
    selectedItem: string | null;
    isOpen: boolean;
    onClose: () => void;
    onSelect: (item: string) => void;
}

function SelectableModal({title, items, selectedItem, isOpen, onClose, onSelect}: SelectableModalProps) {
    return (
        <Modal size="full" isOpen={isOpen} onOpenChange={onClose}>
            <ModalContent>
                {(onCloseModal) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                        <div
                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
                        <ModalBody>
                            <div className="flex flex-col">
                                {items?.map((item : any, index) => (
                                    <div key={index}>
                                        <Button
                                            onPress={() => {
                                                onSelect(item);
                                                onCloseModal();
                                            }}
                                            variant="light"
                                            size="lg"
                                            radius="sm"
                                            className={"flex justify-between py-6 w-full"}
                                        >
                                            {item.name}
                                            {selectedItem === item && (
                                                <IoMdCheckmark className="text-blue-500 text-xl"/>
                                            )}
                                        </Button>
                                        <div
                                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                    </div>
                                ))}
                            </div>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}