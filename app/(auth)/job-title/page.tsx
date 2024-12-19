"use client"
import React, {useState} from "react";
import {Button} from "@nextui-org/button";
// icons
import {IoIosClose, IoIosArrowBack} from "react-icons/io";

const jobTitles = [
    "Research Skills",
    "Analyst",
    "Legal Research",
    "Oil And Gas",
    "Sales Operations",
    "Sales Management",
    "Social Media",
];

export default function TitleJobPage() {
    const [selectedJob, setSelectedJob] = useState<string | null>();

    const handleSelectJob = (job: string) => {
        setSelectedJob(job);
    };

    return (
        <div className="h-screen bg-white flex flex-col text-black py-4 px-2">
            {/* Header */}
            <div className="flex items-center px-4">
                <button className="rounded-lg btn !p-2 !shadow !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </button>
                <h1 className="ml-2 text-lg font-bold">Title Job</h1>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>

            {/* Selected Item */}
            {selectedJob && (
                <>
                    <div className="px-6">
                        <div className="flex items-center justify-between py-3">
                            <span className="text-gray-800 font-medium">{selectedJob}</span>
                            <button
                                className="bg-[#E2E2E2] rounded-lg p-0.5"
                                onClick={() => setSelectedJob(null)}
                            >
                                <IoIosClose className={"text-xl"}/>
                            </button>
                        </div>
                    </div>
                    <div
                        className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </>
            )}


            {/* List */}
            <div className="flex flex-col">
                {jobTitles.map((job, index) => (
                    <>
                        <Button
                            key={index}
                            onPress={() => handleSelectJob(job)}
                            variant={"light"}
                            size={"lg"}
                            radius={"sm"}
                            className={"flex justify-start py-6"}
                        >
                            {job}
                        </Button>
                        <div
                            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                    </>

                ))}
            </div>
        </div>
    );
}
