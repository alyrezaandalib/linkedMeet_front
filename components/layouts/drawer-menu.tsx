import React, { useEffect, useState } from "react";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Logout } from "@/store/userSlice";
import { deleteCookie, getCookie } from "cookies-next";
import { UAParser } from "ua-parser-js";
// icons
import {CiUser} from "react-icons/ci";
import {HiMiniChatBubbleOvalLeftEllipsis} from "react-icons/hi2";
import {IoExit} from "react-icons/io5";
import {PiInfoFill} from "react-icons/pi";
import {TiUser} from "react-icons/ti";
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
            <Button isIconOnly onPress={onOpen} variant={"light"}><LuMenu className={"text-2xl"}/></Button>
            <Drawer
                size={"xs"}
                placement="left"
                radius={"none"}
                backdrop={"blur"}
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >
                <DrawerContent>
                    {(onClose) => (
                        <>
                            <DrawerHeader className="flex flex-col gap-2 justify-center items-center m-10 mb-0">
                                <div
                                    className={`rounded-full h-20 w-20 flex items-center justify-center bg-gray-200 border border-gray-300 ${!user.avatar && "p-3"}`}>
                                    {
                                        user.avatar
                                            ?
                                            <img className={"rounded-full w-full h-full !max-w-20 !max-h-20"}
                                                 src={user.avatar} alt={user.name}/>
                                            :
                                            <CiUser className={"text-3xl"}/>
                                    }
                                </div>
                                <div className={"capitalize"}>{user.name}</div>
                                <div className={"text-gray-500 text-sm font-light"}>{user.email}</div>
                            </DrawerHeader>
                            <div
                                className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-3"></div>


                            <DrawerBody>
                                <Button className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/chat")}>
                                    <HiMiniChatBubbleOvalLeftEllipsis className={"text-xl"}/>
                                    Chats
                                </Button>
                                <Button className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/profile")}>
                                    <TiUser className={"text-xl"}/>
                                    Profile
                                </Button>
                                <Button className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/about-us")}>
                                    <PiInfoFill className={"text-xl"}/>
                                    About Us
                                </Button>
                                <Button
                                    className={"justify-start text-red-500"}
                                    variant={"light"}
                                    radius={"sm"}
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
                                    }}>
                                    <IoExit className={"text-xl"}/>
                                    Sign out
                                </Button>
                            </DrawerBody>

                            <DrawerFooter className={"justify-start text-xs text-gray-400"}>
                                Version {appVersion}
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}
