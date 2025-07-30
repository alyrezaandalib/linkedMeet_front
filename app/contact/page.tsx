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
    IoHeart,
    IoStar,
    IoCheckmarkCircle,
    IoRocket,
    IoShieldCheckmark
} from "react-icons/io5";
import { motion } from "framer-motion";

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
            toast.success("Message sent successfully! We'll get back to you soon.");
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
            delay: 0.1
        },
        {
            icon: IoCall,
            title: "Phone Support",
            value: "+1 (555) 123-4567",
            description: "Call us anytime",
            gradient: "from-green-500 to-blue-500",
            delay: 0.2
        },
        {
            icon: IoLocation,
            title: "Office Location",
            value: "San Francisco, CA",
            description: "Visit our headquarters",
            gradient: "from-purple-500 to-pink-500",
            delay: 0.3
        },
        {
            icon: IoTime,
            title: "24/7 Support",
            value: "Always Available",
            description: "We're here to help",
            gradient: "from-orange-500 to-red-500",
            delay: 0.4
        }
    ];

    const features = [
        {
            icon: IoStar,
            title: "Premium Support",
            description: "Get priority assistance from our expert team"
        },
        {
            icon: IoCheckmarkCircle,
            title: "Fast Response",
            description: "We typically respond within 2 hours"
        },
        {
            icon: IoRocket,
            title: "Quick Solutions",
            description: "Resolve issues efficiently and effectively"
        },
        {
            icon: IoShieldCheckmark,
            title: "Secure & Private",
            description: "Your information is always protected"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="px-5 pt-4">
                <div className="flex items-center mb-6">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => router.back()}
                        className="rounded-xl bg-white shadow-lg p-3 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                    >
                        <IoIosArrowBack className="text-xl text-gray-700" />
                    </motion.div>
                    <motion.h1 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="ml-4 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    >
                        Contact Us
                    </motion.h1>
                </div>
            </div>

            <div className="flex justify-center items-start px-5">
                <div className="w-full max-w-6xl px-3">
                    <motion.div 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <IoChatbubbleOutline className="text-4xl text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                            Get in Touch
                        </h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                            Have questions or need help? We'd love to hear from you. Our dedicated team is here to provide you with the best support experience.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Information */}
                        <motion.div 
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            className="lg:col-span-1 space-y-6"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                    <IoGlobe className="mr-3 text-blue-500 text-2xl" />
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    {contactInfo.map((info, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ x: -30, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: info.delay }}
                                            className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
                                        >
                                            <div className={`w-14 h-14 bg-gradient-to-r ${info.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                                <info.icon className="text-2xl text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 text-lg mb-1">{info.title}</h4>
                                                <p className="text-gray-600 font-semibold text-base">{info.value}</p>
                                                <p className="text-gray-500 text-sm mt-1">{info.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            <motion.div 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.5 }}
                                className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl"
                            >
                                <div className="flex items-center mb-6">
                                    <IoHeart className="text-3xl mr-3" />
                                    <h3 className="text-2xl font-bold">Why Choose LinkedMeet?</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {features.map((feature, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                                            className="flex items-center space-x-3"
                                        >
                                            <feature.icon className="text-xl text-white/90" />
                                            <div>
                                                <h4 className="font-semibold text-white">{feature.title}</h4>
                                                <p className="text-white/80 text-sm">{feature.description}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div 
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.3 }}
                            className="lg:col-span-2"
                        >
                            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                                    <IoDocumentText className="mr-3 text-blue-500 text-2xl" />
                                    Send us a Message
                                </h3>
                                
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.4 }}
                                        >
                                            <label className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                                                <IoPerson className="mr-2 text-blue-500" />
                                                Full Name
                                            </label>
                                            <input
                                                {...register("name", { required: "Name is required." })}
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                                                placeholder="Enter your full name"
                                            />
                                            {errors.name && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                                    {errors.name.message}
                                                </p>
                                            )}
                                        </motion.div>

                                        <motion.div 
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ duration: 0.5, delay: 0.5 }}
                                        >
                                            <label className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                                                <IoMail className="mr-2 text-blue-500" />
                                                Email Address
                                            </label>
                                            <input
                                                {...register("email", { 
                                                    required: "Email is required.",
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: "Invalid email address"
                                                    }
                                                })}
                                                type="email"
                                                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                                                placeholder="Enter your email address"
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm mt-2 flex items-center">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                                    {errors.email.message}
                                                </p>
                                            )}
                                        </motion.div>
                                    </div>

                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                    >
                                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                                            <IoDocumentText className="mr-2 text-blue-500" />
                                            Subject
                                        </label>
                                        <input
                                            {...register("subject", { required: "Subject is required." })}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg"
                                            placeholder="What's this about?"
                                        />
                                        {errors.subject && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                                {errors.subject.message}
                                            </p>
                                        )}
                                    </motion.div>

                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.7 }}
                                    >
                                        <label className="text-sm font-semibold text-gray-700 flex items-center mb-3">
                                            <IoChatbubbleOutline className="mr-2 text-blue-500" />
                                            Message
                                        </label>
                                        <textarea
                                            {...register("message", { 
                                                required: "Message is required.",
                                                minLength: {
                                                    value: 10,
                                                    message: "Message must be at least 10 characters long."
                                                }
                                            })}
                                            rows={6}
                                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 focus:bg-white text-lg resize-none"
                                            placeholder="Tell us how we can help you..."
                                        />
                                        {errors.message && (
                                            <p className="text-red-500 text-sm mt-2 flex items-center">
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                                                {errors.message.message}
                                            </p>
                                        )}
                                    </motion.div>

                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                    >
                                        <Button
                                            type="submit"
                                            isLoading={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                                            size="lg"
                                        >
                                            {isSubmitting ? "Sending Message..." : "Send Message"}
                                        </Button>
                                    </motion.div>
                                </form>
                            </div>
                        </motion.div>
                    </div>

                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="mt-12 text-center"
                    >
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 max-w-2xl mx-auto">
                            <p className="text-gray-600 text-sm">
                                💬 We typically respond within 2 hours during business days
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
} 