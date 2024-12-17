"use client";
import {Button} from "@nextui-org/button";
import useService, {Inputs} from "./service";
import {Controller, useForm} from "react-hook-form";
import {Checkbox} from "@nextui-org/react";

export default function ActivityTypePage() {
    const {onSubmit, sendUserActivityType} = useService();
    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
        watch,
    } = useForm<Inputs>();

    const {isPending} = sendUserActivityType;

    // Watch to see selected activity types
    const selectedActivityTypes = watch("activity_types", []);

    const handleCheckboxChange = (checked: boolean, value: string) => {
        const currentValues = selectedActivityTypes || [];
        if (checked) {
            setValue("activity_types", [...currentValues, value]);
        } else {
            setValue(
                "activity_types",
                currentValues.filter((item: string) => item !== value)
            );
        }
    };

    return (
        <div className={"flex flex-col h-screen"}>
            <div className="text-center flex justify-center items-center text-3xl font-bold h-[10%] text-white">
                LinkedMeet
            </div>
            <div className="flex relative items-center h-[90%] justify-center">
                <div
                    className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}
                ></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">
                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">
                            Company Activity Type
                        </h2>
                        <p className="text-sm text-gray-400 max-w-[90%]">
                            Select the type of activity of your company from the options below
                        </p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"} onSubmit={handleSubmit(onSubmit)}>
                        {/* Checkboxes */}
                        <Controller
                            name="activity_types"
                            control={control}
                            defaultValue={[]}
                            render={() => (
                                <div className={"flex flex-col gap-5"}>
                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Producer / Manufacturer")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Producer / Manufacturer
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Distributor")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Distributor
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Wholesaler")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Wholesaler
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Dealer / Franchise")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Dealer / Franchise
                                    </Checkbox> <Checkbox
                                    onChange={(e) =>
                                        handleCheckboxChange(e.target.checked, "Importer")
                                    }
                                    radius={"sm"}
                                    classNames={{label: "font- text-sm"}}
                                >
                                    Importer
                                </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Retail")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Retail
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Raw Materials Supplier")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Raw Materials Supplier
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Service Provider")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Service Provider
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, "Consulting  Training")
                                        }
                                        radius={"sm"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Consulting Training
                                    </Checkbox>

                                    <Checkbox
                                        onChange={(e) =>
                                            handleCheckboxChange(e.target.checked, " Public Institutions / Association / non-Profit Organisation")
                                        }
                                        radius={"sm"}
                                        className={"max-w-[80%]"}
                                        classNames={{label: "font- text-sm"}}
                                    >
                                        Public Institutions / Association / non-Profit Organisation
                                    </Checkbox>
                                </div>
                            )}
                        />

                        <Button
                            color={"primary"}
                            className={"mt-4"}
                            isLoading={isPending}
                            radius={"sm"}
                            type={"submit"}
                        >
                            OK
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
