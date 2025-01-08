"use client";
import {Button} from "@nextui-org/button";
import useService, {Inputs} from "./service";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import {Checkbox, Spinner} from "@nextui-org/react";
import {useDispatch, useSelector} from "react-redux";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {UpdateCompanyActivityTypes} from "@/store/userSlice";
import {useEffect, useState} from "react";

export default function ActivityTypePage() {

    const router = useRouter();
    const dispatch = useDispatch();
    const [selectedCompanyActivityTypes, setSelectedActivityTypes] = useState<any>([])

    // service
    const {getCompanyActivityTypes,
        getUserActivityTypes ,
        sendUserActivityType ,
    } = useService();

    const getUserActivityTypesResponse = getUserActivityTypes()

    // company activity types list
    const {data, isLoading, isError} = getCompanyActivityTypes();

    const {
        handleSubmit
        , control
        , formState: {errors}
        , setValue
        , watch
    } = useForm<Inputs>({
        defaultValues: {activity_type_ids: []},
        mode: "onBlur",
    });

    // handle sending activity types
    const {isPending} = sendUserActivityType;
    const selectedActivityTypes = watch("activity_type_ids", []);

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs) => {
        sendUserActivityType.mutate(data, {
            onSuccess: () => {
                dispatch(UpdateCompanyActivityTypes(selectedCompanyActivityTypes));
                router.push("/information")
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    const handleCheckboxChange = (checked: boolean, id: string, name: string) => {
        const currentValues = selectedActivityTypes || [];
        if (checked) {
            setValue("activity_type_ids", [...currentValues, id]);
            setSelectedActivityTypes((prevState: any[]) => [...prevState, name]);
        } else {
            setValue("activity_type_ids", currentValues.filter((item: string) => item !== id));
            setSelectedActivityTypes((prevState: any[]) => prevState.filter((item) => item !== name));
        }
    };

    if (getUserActivityTypesResponse.data?.data.length > 0) router.push("/")

    return (
        <div className="flex flex-col h-screen">
            <div className="text-center flex justify-center items-center text-3xl font-bold h-[10%] text-white">
                LinkedMeet
            </div>
            <div className="flex relative items-center h-[90%] justify-center">
                <div className="w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">
                    <div className="flex flex-col gap-1.5">
                        <h2 className="text-2xl font-semibold text-black">Company Activity Type</h2>
                        <p className="text-sm text-gray-400 max-w-[90%]">
                            Select the type of activity of your company from the options below
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="h-full flex justify-center items-center">
                            <Spinner color="primary"/>
                        </div>
                    ) : (
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
                            {
                                data.data ? data?.data?.map((activity_type: any) => (
                                    <Controller
                                        key={activity_type.id}
                                        name="activity_type_ids"
                                        control={control}
                                        rules={{required: "Please select at least one activity type."}}
                                        defaultValue={[]}
                                        render={() => (
                                            <div className="flex flex-col gap-5">
                                                <Checkbox
                                                    onChange={(e: any) =>
                                                        handleCheckboxChange(
                                                            e.target.checked,
                                                            activity_type.id,
                                                            activity_type.name
                                                        )
                                                    }
                                                    radius="sm"
                                                    className="max-w-[80%]"
                                                    classNames={{label: "text-sm"}}
                                                >
                                                    {activity_type.name}
                                                </Checkbox>
                                            </div>
                                        )}
                                    />
                                )) : <div className={"text-sm text-danger"}>An error occurred while retrieving
                                    data.</div>
                            }
                            <div className={`w-full ${!data.data && "hidden"}`}>
                                <Button
                                    color="primary"
                                    className="mt-3 w-full"
                                    isLoading={isPending}
                                    radius="sm"
                                    type="submit"
                                >
                                    OK
                                </Button>
                                {errors.activity_type_ids && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.activity_type_ids.message}
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
