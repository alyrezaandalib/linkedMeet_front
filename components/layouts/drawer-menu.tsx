import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure, Avatar,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Logout } from "@/store/userSlice";
import { deleteCookie, getCookie } from "cookies-next";
import { UAParser } from "ua-parser-js";
// icons
import {IoExit, IoPerson, IoChatbubbleOutline, IoInformationCircle, IoShieldCheckmark, IoCall} from "react-icons/io5";
import {LuMenu} from "react-icons/lu";

interface DrawerMenuProps {
    setIsGpsOnAction: (status: boolean) => void;
    isLoading: boolean;
    setIsLoading: any;
}

export default function DrawerMenu({ setIsGpsOnAction, isLoading, setIsLoading }: DrawerMenuProps) {
    const [userPlatform, setUserPlatform] = useState<any>();
    const [appVersion, setAppVersion] = useState<string>("unknown");

    useEffect(() => {
        if (typeof navigator !== "undefined") {
            const { os } = UAParser(navigator.userAgent);
            setUserPlatform(os);
        }
    }, []);

    useEffect(() => {
        if (userPlatform) {
            fetchAppVersion();
        }
    }, [userPlatform]);

    const fetchAppVersion = async () => {
        try {
            const response: Response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/app/check-version?current_version=0.0.0&platform=${userPlatform.name.toLowerCase()}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCookie("token")}`,
                    'Accept': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json()
                setAppVersion(data?.latest_version || "unknown");
            } else if (response.status === 404) {
                setAppVersion("unknown");
            } else {
                const data = await response.json();
                toast.error(data.message || "An error occurred during version fetch.");
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) {
            setIsGpsOnAction(false);
        }
    }, [isLoading, setIsGpsOnAction]);

    return (
        <>
            <Button 
                isIconOnly 
                onPress={onOpen} 
                variant="bordered"
                className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
                <LuMenu className="text-xl text-gray-700"/>
            </Button>
            <Drawer
                size="sm"
                placement="left"
                radius="none"
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <DrawerContent className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-4 justify-center items-center p-8">
                                <Avatar 
                                    isBordered 
                                    className="w-24 h-24 text-large border-4 border-white shadow-lg" 
                                    src={user.avatar} 
                                    alt={user.name} 
                                />
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 capitalize mb-1">
                                        {user.name}
                                    </h3>
                                    <p className="text-gray-500 text-sm">
                                        {user.email}
                                    </p>
                                </div>
                            </DrawerHeader>

                            <DrawerBody className="px-6 py-4">
                                <div className="space-y-3">
                                    <Button 
                                        className="w-full justify-start bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-xl p-4 h-auto"
                                        variant="light" 
                                        radius="lg"
                                        onPress={() => {
                                            router.push("/chat");
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                                <IoChatbubbleOutline className="text-xl text-white"/>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-800">Chats</div>
                                                <div className="text-xs text-gray-500">View your conversations</div>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button 
                                        className="w-full justify-start bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-xl p-4 h-auto"
                                        variant="light" 
                                        radius="lg"
                                        onPress={() => {
                                            router.push("/profile");
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                                                <IoPerson className="text-xl text-white"/>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-800">Profile</div>
                                                <div className="text-xs text-gray-500">Manage your account</div>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button 
                                        className="w-full justify-start bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-xl p-4 h-auto"
                                        variant="light" 
                                        radius="lg"
                                        onPress={() => {
                                            router.push("/about-us");
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                                <IoInformationCircle className="text-xl text-white"/>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-800">About Us</div>
                                                <div className="text-xs text-gray-500">Learn more about LinkedMeet</div>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button 
                                        className="w-full justify-start bg-white hover:bg-gray-50 shadow-sm border border-gray-100 rounded-xl p-4 h-auto"
                                        variant="light" 
                                        radius="lg"
                                        onPress={() => {
                                            router.push("/contact");
                                            onClose();
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                                                <IoCall className="text-xl text-white"/>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-gray-800">Contact</div>
                                                <div className="text-xs text-gray-500">Get in touch with us</div>
                                            </div>
                                        </div>
                                    </Button>

                                    <Button
                                        className="w-full justify-start bg-white hover:bg-red-50 shadow-sm border border-red-200 rounded-xl p-4 h-auto text-red-600"
                                        variant="light"
                                        radius="lg"
                                        onPress={() => {
                                            setIsLoading(true);
                                            fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/user/gps-status`, {
                                                method: 'PATCH',
                                                headers: {
                                                    'Authorization': `Bearer ${getCookie("token")}`,
                                                    'Accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    is_gps_enabled: false,
                                                }),
                                            })
                                                .then(() => {
                                                    deleteCookie("isLocationSet");
                                                    fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/auth/logout`, {
                                                        method: "POST",
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            'Authorization': `Bearer ${getCookie("token")}`,
                                                            'Accept': 'application/json',
                                                        },
                                                    })
                                                        .then(response => {
                                                            if (!response.ok) {
                                                                toast.error(`HTTP error! status: ${response.status}`);
                                                                throw new Error(`HTTP error! status: ${response.status}`);
                                                            }
                                                            return response.json();
                                                        })
                                                        .then(() => {
                                                            dispatch(Logout());
                                                            router.refresh();
                                                        })
                                                        .catch(error => {
                                                            toast.error(`Error during logout: ${error}`);
                                                            setIsLoading(false);
                                                        });
                                                });
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                                <IoExit className="text-xl text-white"/>
                                            </div>
                                            <div className="text-left">
                                                <div className="font-semibold text-red-600">Sign Out</div>
                                                <div className="text-xs text-red-400">Logout from your account</div>
                                            </div>
                                        </div>
                                    </Button>
                                </div>
                            </DrawerBody>

                            <DrawerFooter className="px-6 py-4">
                                <div className="w-full bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center">
                                            <IoShieldCheckmark className="text-sm text-white"/>
                                        </div>
                                        <div className="text-left">
                                            <div className="text-xs font-medium text-gray-600">App Version</div>
                                            <div className="text-sm text-gray-800">v{appVersion}</div>
                                        </div>
                                    </div>
                                </div>
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
