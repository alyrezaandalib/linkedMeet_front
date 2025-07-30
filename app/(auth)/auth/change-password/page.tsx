"use client"
import Link from "next/link";
import {IoIosArrowBack} from "react-icons/io";
import {IoEye, IoEyeOff} from "react-icons/io5";
import {Button} from "@heroui/react";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {useSelector} from "react-redux";
import toast from "react-hot-toast";

type Inputs = {
    current_password: string;
    password: string;
    password_confirmation: string;
};

export default function ChangePasswordPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const user = useSelector((state: any) => state.user.user);

    const {
        register,
        handleSubmit,
        formState: {errors},
        watch,
        reset
    } = useForm<Inputs>();

    const onSubmit = async (data: Inputs) => {
        setIsLoading(true);

        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/change-password`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    current_password: data.current_password,
                    password: data.password
                }),
            });

            const responseData = await response.json();

            if (response.ok) {
                toast.success(responseData.message);
                reset(); // پاک کردن فرم بعد از موفقیت
            } else {
                toast.error(responseData.message || "An error occurred during password change.");
            }
        } catch (error) {
            toast.error("Network error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={"px-5 pt-4 h-screen flex flex-col bg-white"}>
            <div className="flex items-center">
                <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </Link>
                <h1 className="ml-2 text-lg font-bold">Change Password</h1>
            </div>
            <div className={"h-full flex flex-col mt-7"}>
                <form className={"flex flex-col p-4 mt-7 h-[65%] justify-between"}
                      onSubmit={handleSubmit(onSubmit)}>
                    <div className={"flex flex-col gap-4"}>
                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                Current Password
                            </label>
                            <input
                                {...register("current_password", {
                                    required: "Current password is required.",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 32,
                                        message: "Password must be at most 32 characters long."
                                    }
                                })}
                                type={isVisible ? "text" : "password"}
                                className="form-input"
                                placeholder="Enter your current password"
                                autoComplete="current-password"
                            />
                            {errors.current_password &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.current_password.message}</p>}
                        </div>

                        <div className="relative">
                            <label className="block !mb-0 text-sm font-medium ml-2 rtl:mr-2 text-gray-700">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password", {
                                        required: "New password is required.",
                                        minLength: {
                                            value: 8,
                                            message: "Password must be at least 8 characters long.",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message: "Password must be at most 32 characters long."
                                        }
                                    })}
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    className="form-input w-full !pr-10"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    aria-label="toggle password visibility"
                                    className="absolute top-1/2 right-2 -translate-y-1/3 flex items-center focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <IoEyeOff className="text-2xl text-gray-400"/>
                                    ) : (
                                        <IoEye className="text-2xl text-gray-400"/>
                                    )}
                                </button>
                            </div>
                            {errors.password &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password.message}</p>}
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-1 rtl:mr-2 text-gray-700">
                                Confirm New Password
                            </label>
                            <input
                                {...register("password_confirmation", {
                                    required: "Password confirmation is required.",
                                    validate: value => value === watch('password') || 'Passwords do not match',
                                    minLength: {
                                        value: 8,
                                        message: "Password confirmation must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 32,
                                        message: "Password confirmation must be at most 32 characters long."
                                    }
                                })}
                                type={isVisible ? "text" : "password"}
                                autoComplete="new-password"
                                className="form-input"
                                placeholder="Confirm your new password"
                            />
                            {errors.password_confirmation &&
                                <p className={"text-red-500 text-xs mt-1"}>{errors.password_confirmation.message}</p>}
                        </div>
                    </div>

                    <Button
                        radius={"sm"}
                        color={"primary"}
                        type={"submit"}
                        isLoading={isLoading}
                        className="mt-4"
                    >
                        Change Password
                    </Button>
                </form>
            </div>
        </div>
    )
}
