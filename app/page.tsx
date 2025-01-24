"use client";
import Image from "next/image";
import useService, {Location, User} from "./service";
import DrawerMenu from "@/components/layouts/drawer-menu";
import React, {useEffect, useRef, useState} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Switch} from "@heroui/react";
import toast from "react-hot-toast";
import {SubmitHandler} from "react-hook-form";
import SelectableModal from "@/components/selectableModal";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
import LogoutPage from "@/components/logout";
// images
import disabled_location_image from "../public/images/disabled_location.png";
import no_user_found_image from "../public/images/no_user_found.png";
import users_image from "../public/images/users.png";
// icons
import SendIcon from "@/public/tsx-icons/send";
import {IoChatbubbleOutline, IoDocumentTextOutline} from "react-icons/io5";
import {CiLocationOff, CiLocationOn} from "react-icons/ci";
import {useDispatch, useSelector} from "react-redux";
import {updateUnreadMessages} from "@/store/notificationSlice";

export default function Home() {
    const router = useRouter();

    const dispatch = useDispatch();

    // check notifications
    const notification = useSelector((state: any) => state.notification);

    // services
    const {getUnreadMessagesCount , sendUserLocation, getJobTitlesList, getIndustriesList} = useService();

    // set unread messages
    const unreadMessagesCount = getUnreadMessagesCount();

    useEffect(() => {
        if (unreadMessagesCount.data) {
            dispatch(updateUnreadMessages({
                unreadMessagesCount: unreadMessagesCount.data?.unread_messages_count,
            }));
        }
    }, [unreadMessagesCount]);

    // logout state
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    // GPS
    const [isGpsOn, setIsGpsOn] = useState(getCookie("isLocationSet") === "true");
    const watchId = useRef<number | null>(null);
    const lastSentTime = useRef(0);

    const [isLoading, setIsLoading] = useState(false);

    // selected industry and job_title
    const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList();
    const getJobTitlesListResponse = getJobTitlesList();

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false);

    // nearby users
    const {data: nearbyUsers, refetch: fetchNearbyUsers} = useQuery({
        queryKey: ["/v1/user/nearby-users"],

        queryFn: ({queryKey}) => {
            const baseUrl = queryKey[0];

            const params = new URLSearchParams();
            if (selectedJob) params.append("job_title_ids[]", selectedJob.id);
            if (selectedIndustry)
                params.append("industry_ids[]", selectedIndustry.id);

            const url = `${baseUrl}?${params.toString()}`;

            return fetchService({url});
        },

        refetchOnMount: false,
        refetchInterval: false,
        refetchIntervalInBackground: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        enabled: false,
    });

    useEffect(() => {
        if (selectedIndustry?.id && selectedJob?.id) {
            fetchNearbyUsers();
        }
    }, [selectedIndustry, selectedJob]);

    // update gps status
    const updateGpsStatus = async (isGpsEnabled: boolean) => {
        const response = await fetch(
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

        if (!navigator.geolocation) {
            toast.error("Your device does not support GPS.");
            setIsGpsOn(false);
            return;
        }

        updateGpsStatus(true);
        setCookie("isLocationSet", true);

        watchId.current = navigator.geolocation.watchPosition(
            (position) => {
                const now = Date.now();
                if (now - lastSentTime.current >= 10000) {
                    const {latitude, longitude} = position.coords;
                    onSubmitLocation({latitude, longitude});
                    lastSentTime.current = now;
                }
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    toast.error("Please enable GPS access.");
                } else {
                    toast.error(
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
            console.log("stopTracking NULL");
            navigator.geolocation.clearWatch(watchId.current);
            watchId.current = null;
        }
    };

    useEffect(() => {
        if (isGpsOn) {
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

    const onSubmitLocation: SubmitHandler<Location> = (data: any) => {
        setIsLoading(true);
        sendUserLocation.mutate(data, {
            onSuccess: (response) => {
                fetchNearbyUsers();
            },
            onError: (error) => {
                setIsGpsOn(false);
                toast.error(error.message);
            },
            onSettled(data, error, variables, context) {
                setIsLoading(false);
            },
        });
    };

    if (isLoggingOut) {
        return <LogoutPage/>
    }

    return (
        <div className={"w-full h-screen"}>
            {/* header */}
            <div className={"flex items-center justify-between px-5 py-3"}>
                <DrawerMenu isLoading={isLoggingOut} setIsLoading={setIsLoggingOut} setIsGpsOnAction={setIsGpsOn}/>
                <div className={"flex items-center justify-center gap-3"}>
                    <Button isIconOnly variant={"light"} onPress={() => router.push("/chat")}>
                        <div className={"relative"}>
                            {
                                notification.unreadMessagesCount > 0 &&
                                <div
                                    className={
                                        "absolute bg-danger rounded-full flex items-center justify-center text-white text-xs h-4 w-4 top-0 left-0 transform -translate-x-1 -translate-y-1"
                                    }
                                >
                                    {notification.unreadMessagesCount}
                                </div>
                            }
                            <IoChatbubbleOutline className={"text-2xl"} />
                        </div>
                    </Button>

                    <Switch
                        className={"my-auto"}
                        size={"lg"}
                        aria-label="location"
                        color={"primary"}
                        defaultSelected={isGpsOn}
                        isDisabled={sendUserLocation.isPending}
                        thumbIcon={({isSelected, className}) =>
                            isSelected ? <CiLocationOn className={className}/> : <CiLocationOff className={className}/>
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
            <div className={"h-[calc(100%-64px)] flex justify-center"}>
                {/* when location is off ... */}
                {!isGpsOn && (
                    <div
                        className={
                            "h-full p-10 flex flex-col justify-center items-center gap-4"
                        }
                    >
                        <Image
                            src={disabled_location_image}
                            width={500}
                            alt={"disabled location image"}
                        />
                        <div
                            className={"font-black text-xl text-center w-full"}
                        >
                            Location sharing is disabled.
                        </div>
                        <div className={"text-center"}>
                            To find nearby people, please enable location
                            sharing.
                        </div>
                    </div>
                )}
                {isGpsOn && isLoading ? (
                    <Spinner/>
                ) : (
                    <>
                        {/* when not found user nearby ...*/}
                        {isGpsOn && nearbyUsers?.data.length === 0 && (
                            <div
                                className={
                                    "h-full p-14 flex flex-col justify-center items-center gap-4"
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
                                    The system is automatically scanning for
                                    nearby users, and they will be displayed if
                                    found.
                                </div>
                                {(selectedIndustry !== null ||
                                    selectedJob !== null) && (
                                    <Button
                                        radius={"sm"}
                                        color={"primary"}
                                        className={"w-full"}
                                        onPress={() => {
                                            setSelectedIndustry(null);
                                            setSelectedJob(null);
                                            setTimeout(() => {
                                                fetchNearbyUsers()
                                            }, 100);
                                        }}
                                    >
                                        clear filters
                                    </Button>
                                )}
                            </div>
                        )}

                        {/*when found user nearby ...*/}
                        {isGpsOn && nearbyUsers?.data.length > 0 && (
                            <div
                                className={
                                    "h-full p-4 bg-[#f9f9f9] w-full overflow-y-auto flex flex-col items-center gap-4"
                                }
                            >
                                <Image src={users_image} alt={"users"}/>
                                <div
                                    className={
                                        "font-black text-xl text-center w-full"
                                    }
                                >
                                    Congratulations!
                                </div>
                                <div className={"text-center text-gray-600"}>
                                    The following people have been found near
                                    you. You can start a conversation with them
                                    by clicking on their profiles.
                                </div>
                                <div className={"w-full flex justify-between items-center gap-1"}>
                                    <input
                                        readOnly
                                        placeholder="Filter job title..."
                                        className="form-input form-input-sm !m-0"
                                        value={selectedJob?.name || ""}
                                        onClick={() =>
                                            setJobTitleModalOpen(true)
                                        }
                                    />
                                    <input
                                        readOnly
                                        placeholder="Filter industry..."
                                        className="form-input form-input-sm !m-0"
                                        value={selectedIndustry?.name || ""}
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
                                    {nearbyUsers?.data.map((user: User) => (
                                        <div
                                            key={user.id}
                                            className={
                                                "bg-white shadow-sm flex flex-col items-center justify-center gap-2 p-4 rounded-lg"
                                            }
                                        >
                                            <div
                                                className={
                                                    "w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"
                                                }
                                            >
                                                <img
                                                    alt={user.name}
                                                    src={user.avatar}
                                                    className={
                                                        "rounded-full h-full w-full bg-gray-200 border border-gray-300 !max-w-12 !max-h-12"
                                                    }
                                                />
                                            </div>
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

                                            <div className={"flex gap-1"}>
                                                <Button
                                                    size={"sm"}
                                                    variant={"bordered"}
                                                    onPress={() => {
                                                        setSelectedUser(user);
                                                        setIsUserInfoModalOpen(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <IoDocumentTextOutline
                                                        className={"text-lg"}
                                                    />
                                                </Button>
                                                <Button
                                                    onPress={() =>
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
                                                    size={"sm"}
                                                    variant={"bordered"}
                                                >
                                                    <SendIcon
                                                        className={"text-black"}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
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
                        items={getIndustriesListResponse.data?.data || []}
                        selectedItem={selectedIndustry}
                        isOpen={isIndustryModalOpen}
                        onClose={() => setIndustryModalOpen(false)}
                        onSelect={(item) => {
                            setSelectedIndustry(item);
                            setIndustryModalOpen(false);
                        }}
                    />

                    {/* Job Title Modal */}
                    <SelectableModal
                        title="Job Title"
                        items={getJobTitlesListResponse.data?.data || []}
                        selectedItem={selectedJob}
                        isOpen={isJobTitleModalOpen}
                        onClose={() => setJobTitleModalOpen(false)}
                        onSelect={(item) => {
                            setSelectedJob(item);
                            setJobTitleModalOpen(false);
                        }}
                    />
                </>
            )}

            {/* user info modal  */}
            <Modal
                placement={"center"}
                size={"xs"}
                isOpen={isUserInfoModalOpen}
                onOpenChange={setIsUserInfoModalOpen}
            >
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                user Info
                            </ModalHeader>
                            <div
                                className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
                            <ModalBody className={"p-3"}>
                                <div className="flex flex-col items-center gap-2.5">
                                    <div
                                        className={
                                            "h-16 w-16 border border-gray-200 rounded-full"
                                        }
                                    >
                                        <img
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                            className={
                                                "rounded-full h-full w-full bg-gray-200 border border-gray-300 !max-w-16 !max-h-16"
                                            }
                                        />
                                    </div>
                                    <div className={"font-mono"}>
                                        {selectedUser.name}
                                    </div>
                                    <div
                                        className={
                                            "flex flex-col gap-4 text-xs w-full"
                                        }
                                    >
                                        <div className={"flex gap-2"}>
                                            <div
                                                className={
                                                    "font-semibold w-[50%] p-1"
                                                }
                                            >
                                                industry:
                                            </div>
                                            <div className={"text-wrap"}>
                                                {selectedUser.industry}
                                            </div>
                                        </div>
                                        <div className={"flex gap-2"}>
                                            <div
                                                className={
                                                    "font-semibold w-[50%] p-1"
                                                }
                                            >
                                                title job:
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
                                    className={"w-full mt-4"}
                                    color={"primary"}
                                >
                                    <SendIcon/>
                                    Chat
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
