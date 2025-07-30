"use client";
import Image from "next/image";
import useService, { User } from "./service";
import DrawerMenu from "@/components/layouts/drawer-menu";
import React, { useEffect, useRef, useState } from "react";
import {
    Avatar,
    Button,
    Modal,
    ModalBody,
    ModalContent,
    Spinner,
    Switch,
} from "@heroui/react";
import toast from "react-hot-toast";
import SelectableModal from "@/components/selectableModal";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchService } from "@/services/crud-services/fetch-service";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import LogoutPage from "@/components/logout";
import { motion } from "framer-motion";
import { useDrag } from "@use-gesture/react";
import { updateUnreadMessages } from "@/store/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
// images
import disabled_location_image from "../public/images/disabled_location.png";
import no_user_found_image from "../public/images/no_user_found.png";
import users_image from "../public/images/users.png";
// icons
import SendIcon from "@/public/tsx-icons/send";
import { IoChatbubbleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { CiLocationOff, CiLocationOn } from "react-icons/ci";

export default function Home() {
    const router = useRouter();

    const dispatch = useDispatch();

    // check notifications
    const notification = useSelector((state: any) => state.notification);

    // services
    const {
        getUnreadMessagesCount,
        sendUserLocation,
        getJobTitlesList,
        getIndustriesList,
    } = useService();

    // set unread messages
    const unreadMessagesCount = getUnreadMessagesCount();

    useEffect(() => {
        if (unreadMessagesCount.data) {
            dispatch(
                updateUnreadMessages({
                    unreadMessagesCount:
                        unreadMessagesCount.data?.unread_messages_count,
                })
            );
        }
    }, [unreadMessagesCount.data]);

    // logout state
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // GPS
    const [isGpsOn, setIsGpsOn] = useState(
        getCookie("isLocationSet") === "true"
    );
    const watchId = useRef<number | null>(null);
    const lastSentTime = useRef(0);
    const toastErrorGPS = useRef<string | null>(null);

    const [isLoading, setIsLoading] = useState(false);

    const [modalsSearchInput, setModalsSearchInput] = useState<any>({
        job_title: "",
        industry: "",
    });

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList(
        modalsSearchInput.industry
    );
    const getJobTitlesListResponse = getJobTitlesList(
        modalsSearchInput.job_title
    );

    useEffect(() => {
        setTimeout(() => {
            getIndustriesListResponse.refetch();
        }, 500);
    }, [modalsSearchInput?.industry]);

    useEffect(() => {
        setTimeout(() => {
            getJobTitlesListResponse.refetch();
        }, 500);
    }, [modalsSearchInput?.job_title]);

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);
    const isFirstFetchNearbyUsers = useRef(true);

    // nearby users
    const { data: nearbyUsers, refetch: fetchNearbyUsers } = useQuery({
        queryKey: ["/v1/user/nearby-users"],

        queryFn: ({ queryKey }) => {
            const baseUrl = queryKey[0];

            const params = new URLSearchParams();
            if (selectedJob) {
                params.append("job_title_ids[]", selectedJob.id);
            }

            if (selectedIndustry) {
                params.append("industry_ids[]", selectedIndustry.id);
            }

            const url = `${baseUrl}?${params.toString()}`;

            return fetchService({ url });
        },

        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false,
    });

    // selected industry and job_title
    const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        fetchNearbyUsers();
    }, [selectedIndustry, selectedJob]);

    // update gps status
    const updateGpsStatus = async (isGpsEnabled: boolean) => {
        await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/user/gps-status`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${getCookie("token")}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    is_gps_enabled: isGpsEnabled,
                }),
            }
        );
    };

    const startTracking = () => {
        if (watchId.current !== null) {
            return;
        }

        if (toastErrorGPS.current) {
            toast.remove(toastErrorGPS.current);
        }

        if (!navigator.geolocation) {
            toastErrorGPS.current = toast.error(
                "Your device does not support GPS."
            );
            setIsGpsOn(false);
            return;
        }

        updateGpsStatus(true);
        isFirstFetchNearbyUsers.current = true;
        setCookie("isLocationSet", true);

        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                const now = Date.now();
                if (now - lastSentTime.current >= 10000) {
                    const { latitude, longitude } = position.coords;
                    sendUserLocation.mutate(
                        { latitude, longitude },
                        {
                            onSuccess: () => {
                                if (isFirstFetchNearbyUsers.current) {
                                    isFirstFetchNearbyUsers.current = false;
                                    fetchNearbyUsers().then(() => {
                                        setIsLoading(false);
                                    });
                                }
                            },
                            onError: (error) => {
                                setIsGpsOn(false);
                                toast.error(error.message);
                            },
                        }
                    );
                    lastSentTime.current = now;
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    toastErrorGPS.current = toast.error(
                        "Please enable GPS access."
                    );
                } else {
                    toastErrorGPS.current = toast.error(
                        "Error in retrieving location." + error.message
                    );
                }

                setIsGpsOn(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );
    };

    const stopTracking = () => {
        if (watchId.current !== null) {
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    useEffect(() => {
        if (isGpsOn) {
            setIsLoading(true);
            startTracking();
        }

        if (!isGpsOn) {
            deleteCookie("isLocationSet");
            updateGpsStatus(false);
            stopTracking();
        }

        return () => {
            stopTracking();
        };
    }, [isGpsOn]);

    // selected user
    const [selectedUser, setSelectedUser] = useState<any>();

    useEffect(() => {
        let startY = 0;

        const handleTouchStart = (e: any) => {
            startY = e.touches[0].clientY;
        };

        const handleTouchMove = (e: any) => {
            const currentY = e.touches[0].clientY;
            if (currentY > startY && window.scrollY === 0) {
                e.preventDefault();
            }
        };

        document.addEventListener("touchstart", handleTouchStart, {
            passive: false,
        });
        document.addEventListener("touchmove", handleTouchMove, {
            passive: false,
        });

        return () => {
            document.removeEventListener("touchstart", handleTouchStart);
            document.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    const [refreshing, setRefreshing] = useState(false);

    const handleRefresh = async () => {
        setRefreshing(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await fetchNearbyUsers();
        setRefreshing(false);
    };

    const bind = useDrag(
        ({ down, movement: [_, my] }) => {
            if (!isGpsOn) {
                return;
            }

            if (down && my > 100 && !refreshing) {
                handleRefresh();
            }
        },
        { axis: "y" }
    );

    if (isLoggingOut) {
        return <LogoutPage />;
    }

    return (
        <div {...bind()} style={{ touchAction: "pan-y" }}>
            <motion.div
                animate={{ y: refreshing ? 0 : -100 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "#000",
                    color: "#fff",
                    padding: refreshing ? 10 : 0,
                    textAlign: "center",
                    zIndex: 100,
                    borderBottomLeftRadius: "40px",
                    borderBottomRightRadius: "40px",
                }}
            >
                {refreshing && (
                    <div
                        className={
                            "flex justify-center items-center gap-2 text-white text-sm z-50"
                        }
                    >
                        <Spinner color={"white"} size={"sm"} /> Fetching nearby
                        users, Please wait...
                    </div>
                )}
            </motion.div>

            <motion.div
                animate={{
                    marginTop: refreshing ? 50 : 0,
                }}
                transition={{ type: "spring", stiffness: 300 }}
            >
                <div className={"w-full overflow-hidden"}>
                    {/* header */}
                    <div
                        className={
                            "flex items-center justify-between px-5 py-3"
                        }
                    >
                        <DrawerMenu
                            isLoading={isLoggingOut}
                            setIsLoading={setIsLoggingOut}
                            setIsGpsOnAction={setIsGpsOn}
                        />
                        <div
                            className={"flex items-center justify-center gap-3"}
                        >
                            <Button
                                isIconOnly
                                variant={"light"}
                                onPress={() => router.push("/chat")}
                            >
                                <div className={"relative"}>
                                    {notification.unreadMessagesCount > 0 && (
                                        <div
                                            className={
                                                "absolute bg-danger rounded-full flex items-center justify-center text-white text-xs h-4 w-4 top-0 left-0 transform -translate-x-1 -translate-y-1"
                                            }
                                        >
                                            {notification.unreadMessagesCount}
                                        </div>
                                    )}
                                    <IoChatbubbleOutline
                                        className={"text-2xl"}
                                    />
                                </div>
                            </Button>

                            <Switch
                                className={"my-auto"}
                                size={"lg"}
                                aria-label="location"
                                color={"primary"}
                                defaultSelected={isGpsOn}
                                isSelected={isGpsOn}
                                isDisabled={sendUserLocation.isPending}
                                thumbIcon={({ isSelected, className }) =>
                                    isSelected ? (
                                        <CiLocationOn className={className} />
                                    ) : (
                                        <CiLocationOff className={className} />
                                    )
                                }
                                onValueChange={(E) => {
                                    if (E) {
                                        setIsGpsOn(true);
                                    } else {
                                        setIsGpsOn(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div
                        id={"div-content"}
                        className={"h-[calc(100vh-64px)] flex justify-center"}
                    >
                        {/* when location is off ... */}
                        {!isGpsOn && (
                            <div
                                className={
                                    "p-10 flex flex-col justify-center items-center gap-4"
                                }
                            >
                                <Image
                                    src={disabled_location_image}
                                    width={500}
                                    alt={"disabled location image"}
                                />
                                <div
                                    className={
                                        "font-black text-xl text-center w-full"
                                    }
                                >
                                    Location sharing is disabled.
                                </div>
                                <div className={"text-center"}>
                                    To find nearby people, please enable
                                    location sharing.
                                </div>
                            </div>
                        )}
                        {isGpsOn && isLoading ? (
                            <div
                                className={
                                    "p-10 flex flex-col justify-center items-center gap-4"
                                }
                            >
                                <Spinner />
                            </div>
                        ) : (
                            <>
                                {/* when not found user nearby ...*/}
                                {isGpsOn && nearbyUsers?.data.length === 0 && (
                                    <div
                                        className={
                                            " p-14 flex flex-col justify-center items-center gap-4"
                                        }
                                    >
                                        <Image
                                            src={no_user_found_image}
                                            width={500}
                                            alt={"no user found image"}
                                        />
                                        <div
                                            className={
                                                "font-black text-xl text-center w-full"
                                            }
                                        >
                                            No nearby user found
                                        </div>
                                        <div className={"text-center"}>
                                            The system automatically sends your
                                            location to the server{" "}
                                            <strong>every 10 seconds</strong>.
                                            To see nearby users, pull down the
                                            page to refresh{" "}
                                            <strong>(pull to refresh)</strong>.
                                        </div>
                                        {(selectedIndustry !== null ||
                                            selectedJob !== null) && (
                                            <Button
                                                radius={"sm"}
                                                className={"w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"}
                                                onPress={() => {
                                                    setSelectedIndustry(null);
                                                    setSelectedJob(null);
                                                }}
                                            >
                                                Clear filters
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {/*when found user nearby ...*/}
                                {isGpsOn && nearbyUsers?.data.length > 0 && (
                                    <div
                                        className={
                                            "h-full p-4 bg-[#f9f9f9] w-full overflow-y-scroll flex flex-col items-center gap-4"
                                        }
                                    >
                                        <Image
                                            src={users_image}
                                            alt={"users"}
                                        />
                                        <div
                                            className={
                                                "font-black text-xl text-center w-full"
                                            }
                                        >
                                            Congratulations!
                                        </div>
                                        <div
                                            className={
                                                "text-center text-gray-600"
                                            }
                                        >
                                            The following people have been found
                                            near you. You can start a
                                            conversation with them by clicking
                                            on their profiles.
                                        </div>
                                        <div
                                            className={
                                                "w-full flex justify-between items-center gap-1"
                                            }
                                        >
                                            <input
                                                readOnly
                                                placeholder="Filter by job title"
                                                className="form-input form-input-sm !m-0"
                                                value={selectedJob?.name || ""}
                                                onClick={() =>
                                                    setJobTitleModalOpen(true)
                                                }
                                            />
                                            <input
                                                readOnly
                                                placeholder="Filter by industry"
                                                className="form-input form-input-sm !m-0"
                                                value={
                                                    selectedIndustry?.name || ""
                                                }
                                                onClick={() =>
                                                    setIndustryModalOpen(true)
                                                }
                                            />
                                        </div>
                                        <div
                                            className={
                                                "grid grid-cols-2 gap-2.5 w-full"
                                            }
                                        >
                                            {nearbyUsers?.data.map(
                                                (user: User) => (
                                                    <div
                                                        key={user.id}
                                                        className={
                                                            "bg-white shadow-sm flex flex-col items-center justify-center gap-2 p-4 rounded-lg"
                                                        }
                                                        onClick={() =>
                                                            router.push(
                                                                `/chat/${
                                                                    user.id
                                                                }?user=${encodeURIComponent(
                                                                    JSON.stringify(
                                                                        user
                                                                    )
                                                                )}`
                                                            )
                                                        }
                                                    >
                                                        <Avatar
                                                            isBordered
                                                            className="min-w-12 w-12 min-h-12 h-12 text-large"
                                                            src={user.avatar}
                                                            alt={user.name}
                                                        />
                                                        <div
                                                            className={
                                                                "font-medium text-center text-gray-800 capitalize"
                                                            }
                                                        >
                                                            {user.name}
                                                        </div>

                                                        <div
                                                            className={
                                                                "text-xs text-gray-500 text-center"
                                                            }
                                                        >
                                                            {user.job_title +
                                                                " / " +
                                                                user.industry}
                                                        </div>

                                                        <div
                                                            className={
                                                                "flex gap-2"
                                                            }
                                                        >
                                                            <Button
                                                                className={
                                                                    "!border-1"
                                                                }
                                                                size={"sm"}
                                                                variant={
                                                                    "bordered"
                                                                }
                                                                onPress={() => {
                                                                    setSelectedUser(
                                                                        user
                                                                    );
                                                                    setIsUserInfoModalOpen(
                                                                        true
                                                                    );
                                                                }}
                                                            >
                                                                <IoDocumentTextOutline
                                                                    className={
                                                                        "text-lg"
                                                                    }
                                                                />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                    {getIndustriesListResponse.data?.data && (
                        <>
                            {/* Industry Modal */}
                            <SelectableModal
                                title="Industry"
                                handleSearch={(searchValue: string) =>
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        industry: searchValue,
                                    })
                                }
                                items={
                                    getIndustriesListResponse.data?.data || []
                                }
                                selectedItem={selectedIndustry}
                                isOpen={isIndustryModalOpen}
                                onClose={() => {
                                    setIndustryModalOpen(false);
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        industry: "",
                                    });
                                }}
                                onSelect={(item) => {
                                    setSelectedIndustry(item);
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        industry: "",
                                    });
                                    setIndustryModalOpen(false);
                                }}
                            />

                            {/* Job Title Modal */}
                            <SelectableModal
                                title="Job Title"
                                handleSearch={(searchValue: string) =>
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        job_title: searchValue,
                                    })
                                }
                                items={
                                    getJobTitlesListResponse.data?.data || []
                                }
                                selectedItem={selectedJob}
                                isOpen={isJobTitleModalOpen}
                                onClose={() => {
                                    setJobTitleModalOpen(false);
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        job_title: "",
                                    });
                                }}
                                onSelect={(item) => {
                                    setSelectedJob(item);
                                    setModalsSearchInput({
                                        ...modalsSearchInput,
                                        job_title: "",
                                    });
                                    setJobTitleModalOpen(false);
                                }}
                            />
                        </>
                    )}
                </div>
                {/* user info modal  */}
                <Modal
                    placement={"center"}
                    size={"xs"}
                    isOpen={isUserInfoModalOpen}
                    onOpenChange={setIsUserInfoModalOpen}
                >
                    <ModalContent>
                        {() => (
                            <>
                                <ModalBody className={"p-3"}>
                                    <div className="flex flex-col items-center gap-2.5">
                                        <Avatar
                                            isBordered
                                            className="min-w-16 w-16 min-h-16 h-16 text-large"
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                        />
                                        <div className={"font-mono"}>
                                            {selectedUser.name}
                                        </div>
                                        <div
                                            className={
                                                "flex flex-col gap-2 text-xs w-full"
                                            }
                                        >
                                            <div
                                                className={
                                                    "flex gap-2 shadow rounded-lg p-2"
                                                }
                                            >
                                                <div
                                                    className={
                                                        "font-semibold w-[50%] p-1"
                                                    }
                                                >
                                                    Industry:
                                                </div>
                                                <div className={"text-wrap"}>
                                                    {selectedUser.industry}
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    "flex gap-2 shadow rounded-lg p-2"
                                                }
                                            >
                                                <div
                                                    className={
                                                        "font-semibold w-[50%] p-1"
                                                    }
                                                >
                                                    Job title:
                                                </div>
                                                <div className={"text-wrap"}>
                                                    {selectedUser.job_title}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        onPress={() =>
                                            router.push(
                                                `/chat/${
                                                    selectedUser.id
                                                }?user=${encodeURIComponent(
                                                    JSON.stringify(selectedUser)
                                                )}`
                                            )
                                        }
                                        className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                    >
                                        <SendIcon />
                                        Chat
                                    </Button>
                                </ModalBody>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </motion.div>
        </div>
    );
}
