"use client";

import { IoIosArrowBack } from "react-icons/io";
import { IoInformationCircle, IoPeople, IoGlobe, IoRocket } from "react-icons/io5";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
    const router = useRouter();

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
                        About Us
                    </h1>
                </div>
            </div>

            <div className="flex justify-center items-center px-5">
                <div className="w-full max-w-md px-3">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <IoInformationCircle className="text-3xl text-white" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Welcome to LinkedMeet
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Expanding your network, one connection at a time
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <IoPeople className="text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Network Expansion</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        LinkedMeet allows you to significantly expand your network and connect with many people around you. Take the power of your connections to new heights.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <IoGlobe className="text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Global Reach</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Connect with professionals worldwide and discover opportunities that transcend geographical boundaries.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <IoRocket className="text-xl text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-2">Career Growth</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Leverage your network to accelerate your career growth and discover new professional opportunities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 mb-2 text-center">
                        <p className="text-xs text-gray-400">
                            Building meaningful connections for a better future
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
