"use client";

import React, { useState } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import {
    IoMail,
    IoCall,
    IoLocation,
    IoTime,
    IoPerson,
    IoDocumentText,
    IoChatbubbleOutline,
    IoGlobe,
    IoInformationCircle,
} from "react-icons/io5";

type ContactFormData = {
    name: string;
    email: string;
    subject: string;
    message: string;
};

export default function ContactPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ContactFormData>();

    const onSubmit = async (data: ContactFormData) => {
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success(
                "Message sent successfully! We'll get back to you soon."
            );
            reset();
            setIsSubmitting(false);
        }, 2000);
    };

    const contactInfo = [
        {
            icon: IoMail,
            title: "Email Support",
            value: "support@linkedmeet.com",
            description: "Get help via email",
            gradient: "from-blue-500 to-purple-500",
        },
        {
            icon: IoCall,
            title: "Phone Support",
            value: "+1 (555) 123-4567",
            description: "Call us anytime",
            gradient: "from-green-500 to-blue-500",
        },
        {
            icon: IoLocation,
            title: "Office Location",
            value: "San Francisco, CA",
            description: "Visit our headquarters",
            gradient: "from-purple-500 to-pink-500",
        },
        {
            icon: IoTime,
            title: "24/7 Support",
            value: "Always Available",
            description: "We're here to help",
            gradient: "from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="px-5 pt-4">
                <div className="flex items-center mb-6">
                    <div
                        onClick={() => router.back()}
                        className="rounded-xl bg-white shadow-lg p-3 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        <IoIosArrowBack className="text-xl text-gray-700" />
                    </div>
                    <h1 className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Contact Us
                    </h1>
                </div>
            </div>

            <div className="flex justify-center items-start px-5">
                <div className="w-full max-w-md px-3">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoCall className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Get in Touch
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Have questions or need help? We'd love to hear from
                            you.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Contact Information */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4 mb-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <IoGlobe className="text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Contact Information
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Reach out to us through any of these
                                        channels
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-all duration-300"
                                    >
                                        <div
                                            className={`w-8 h-8 bg-gradient-to-r ${info.gradient} rounded-full flex items-center justify-center flex-shrink-0`}
                                        >
                                            <info.icon className="text-sm text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800 text-sm mb-1">
                                                {info.title}
                                            </h4>
                                            <p className="text-gray-600 text-sm font-medium">
                                                {info.value}
                                            </p>
                                            <p className="text-gray-500 text-xs mt-1">
                                                {info.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <IoDocumentText className="text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">
                                        Send us a Message
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Fill out the form below and we'll get
                                        back to you soon
                                    </p>
                                </div>
                            </div>

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                        <IoPerson className="mr-2 text-blue-500 text-sm" />
                                        Full Name
                                    </label>
                                    <input
                                        {...register("name", {
                                            required: "Name is required.",
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-sm"
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                        <IoMail className="mr-2 text-blue-500 text-sm" />
                                        Email Address
                                    </label>
                                    <input
                                        {...register("email", {
                                            required: "Email is required.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message:
                                                    "Invalid email address",
                                            },
                                        })}
                                        type="email"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-sm"
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                        <IoDocumentText className="mr-2 text-blue-500 text-sm" />
                                        Subject
                                    </label>
                                    <input
                                        {...register("subject", {
                                            required: "Subject is required.",
                                        })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-sm"
                                        placeholder="What's this about?"
                                    />
                                    {errors.subject && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                                            {errors.subject.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm font-semibold text-gray-700 flex items-center mb-2">
                                        <IoChatbubbleOutline className="mr-2 text-blue-500 text-sm" />
                                        Message
                                    </label>
                                    <textarea
                                        {...register("message", {
                                            required: "Message is required.",
                                            minLength: {
                                                value: 10,
                                                message:
                                                    "Message must be at least 10 characters long.",
                                            },
                                        })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-sm resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                    {errors.message && (
                                        <p className="text-red-500 text-xs mt-1 flex items-center">
                                            <span className="w-1 h-1 bg-red-500 rounded-full mr-1"></span>
                                            {errors.message.message}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm"
                                    size="lg"
                                >
                                    {isSubmitting
                                        ? "Sending Message..."
                                        : "Send Message"}
                                </Button>
                            </form>
                        </div>
                    </div>

                    <div className="mt-8 mb-2 text-center">
                        <p className="text-xs text-gray-400">
                            We typically respond within 2 hours during business
                            days
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
