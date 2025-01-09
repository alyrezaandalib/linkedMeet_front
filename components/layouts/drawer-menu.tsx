"use client"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
} from "@nextui-org/react";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";

// icons
import {CiUser} from "react-icons/ci";
import {HiMiniChatBubbleOvalLeftEllipsis} from "react-icons/hi2";
import {IoExit} from "react-icons/io5";
import {PiInfoFill} from "react-icons/pi";
import {TiUser} from "react-icons/ti";
import {LuMenu} from "react-icons/lu";
import toast from "react-hot-toast";
import {Logout} from "@/store/userSlice";
import {getCookie} from "cookies-next";
import {useState} from "react";

export default function DrawerMenu() {

    const user = useSelector((state: any) => state.user.user);

    const [isLoading, setIsLoading] = useState(false)

    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const router = useRouter()
    const dispatch = useDispatch();

    return (
        <>
            <Button isIconOnly onPress={onOpen} variant={"light"}><LuMenu className={"text-2xl"}/></Button>
            <Drawer
                size={"xs"}
                placement="left"
                radius={"none"}
                backdrop={"blur"}
                isOpen={isOpen}
                // motionProps={{
                //     variants: {
                //         enter: {
                //             opacity: 1,
                //             x: 0,
                //             // @ts-ignore
                //             duration: 0.3,
                //         },
                //         exit: {
                //             x: 100,
                //             opacity: 0,
                //             // @ts-ignore
                //             duration: 0.3,
                //         },
                //     },
                // }}
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
                                            <img className={"rounded-full"} src={user.avatar} alt={user.name}/>
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
                                <Button isDisabled={isLoading} className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/chat")}>
                                    <HiMiniChatBubbleOvalLeftEllipsis className={"text-xl"}/>
                                    Chat
                                </Button>
                                <Button isDisabled={isLoading} className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/profile")}>
                                    <TiUser className={"text-xl"}/>
                                    Profile
                                </Button>
                                <Button isDisabled={isLoading} className={"justify-start"} variant={"light"} radius={"sm"}
                                        onPress={() => router.push("/about-us")}>
                                    <PiInfoFill className={"text-xl"}/>
                                    About Us
                                </Button>
                                <Button
                                    isLoading={isLoading}
                                    className={"justify-start text-red-500"}
                                    variant={"light"}
                                    radius={"sm"}
                                    onPress={() => {
                                        setIsLoading(true)
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
                                                    toast.error(`HTTP error! status: ${response.status}`)
                                                    throw new Error(`HTTP error! status: ${response.status}`);
                                                }
                                                return response.json();
                                            })
                                            .then(data => {
                                                setIsLoading(false)
                                                dispatch(Logout())
                                                router.refresh()
                                            })
                                            .catch(error => {
                                                toast.error(`Error fetching LinkedIn auth URL: ${error}`);
                                                setIsLoading(false)
                                            });
                                    }}>
                                    <IoExit className={"text-xl"}/>
                                    {isLoading ? "Logging out" : "Exit"}
                                </Button>
                            </DrawerBody>

                            <DrawerFooter className={"justify-start text-xs text-gray-400"}>
                                Version 1.2.4
                            </DrawerFooter>
                        </>
                    )}
                </DrawerContent>
            </Drawer>
        </>
    );
}