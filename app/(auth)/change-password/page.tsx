"use client";

import { Button } from "@heroui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useService, { Inputs } from "./service";
// icons
import { IoIosArrowBack } from "react-icons/io";
import {
    IoEye,
    IoEyeOff,
    IoLockClosed,
    IoShieldCheckmark,
} from "react-icons/io5";


export default function ChangePasswordPage() {
    const { changePassword } = useService();
    const router = useRouter();
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);

    const changePasswordMutiation = changePassword;

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<Inputs>();

    const onSubmit = async (data: Inputs) => {
        changePassword.mutate(data, {
            onSuccess: () => {
                toast.success("Password changed successfully");
                router.back();
                reset();
            },
            onError: (error) => {
                toast.error(error.message);
            },
        });
    };

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
                        Change Password
                    </h1>
                </div>
            </div>

            <div className="flex justify-center items-center px-5">
                <div className="w-full max-w-md px-3">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoShieldCheckmark className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Update Your Password
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Keep your account secure with a strong password
                        </p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 bg-white "
                    >
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <IoLockClosed className="mr-2 text-gray-500" />
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("current_password", {
                                        required:
                                            "Current password is required.",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Password must be at least 8 characters long.",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message:
                                                "Password must be at most 32 characters long.",
                                        },
                                    })}
                                    type={isVisible ? "text" : "password"}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                    placeholder="Enter your current password"
                                    autoComplete="current-password"
                                />
                            </div>
                            {errors.current_password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                    {errors.current_password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className=" text-sm font-medium text-gray-700 flex items-center">
                                <IoLockClosed className="mr-2 text-gray-500" />
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    {...register("password", {
                                        required: "New password is required.",
                                        minLength: {
                                            value: 8,
                                            message:
                                                "Password must be at least 8 characters long.",
                                        },
                                        maxLength: {
                                            value: 32,
                                            message:
                                                "Password must be at most 32 characters long.",
                                        },
                                    })}
                                    type={isVisible ? "text" : "password"}
                                    autoComplete="new-password"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white pr-12"
                                    placeholder="Enter your new password"
                                />
                                <button
                                    type="button"
                                    onClick={toggleVisibility}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                >
                                    {isVisible ? (
                                        <IoEyeOff className="text-xl" />
                                    ) : (
                                        <IoEye className="text-xl" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 flex items-center">
                                <IoLockClosed className="mr-2 text-gray-500" />
                                Confirm New Password
                            </label>
                            <input
                                {...register("password_confirmation", {
                                    required:
                                        "Password confirmation is required.",
                                    validate: (value) =>
                                        value === watch("password") ||
                                        "Passwords do not match",
                                    minLength: {
                                        value: 8,
                                        message:
                                            "Password confirmation must be at least 8 characters long.",
                                    },
                                    maxLength: {
                                        value: 32,
                                        message:
                                            "Password confirmation must be at most 32 characters long.",
                                    },
                                })}
                                type={isVisible ? "text" : "password"}
                                autoComplete="new-password"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white"
                                placeholder="Confirm your new password"
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1 flex items-center">
                                    <span className="w-1 h-1 bg-red-500 rounded-full mr-2"></span>
                                    {errors.password_confirmation.message}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            isLoading={changePasswordMutiation.isPending}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                            size="lg"
                        >
                            {changePasswordMutiation.isPending
                                ? "Updating..."
                                : "Update Password"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Your password will be updated securely
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
