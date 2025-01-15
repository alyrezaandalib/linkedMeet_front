"use client"
import Image from "next/image";
import useService, {Location, User} from "./service"
import DrawerMenu from "@/components/layouts/drawer-menu";
import {useEffect, useRef, useState} from "react";
import {Button, Modal, ModalBody, ModalContent, ModalHeader, Spinner, Tab, Tabs} from "@nextui-org/react";
import toast from "react-hot-toast";
import {SubmitHandler} from "react-hook-form";
import SelectableModal from "@/components/selectableModal";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import {fetchService} from "@/services/crud-services/fetch-service";
import {deleteCookie, getCookie, setCookie} from "cookies-next";
// images
import disabled_location_image from "../public/images/disabled_location.png"
import no_user_found_image from "../public/images/no_user_found.png"
import users_image from "../public/images/users.png"
// icons
import {FaPowerOff} from "react-icons/fa6";
import SendIcon from "@/public/tsx-icons/send";
import {IoDocumentTextOutline} from "react-icons/io5";


export default function Home() {

    const router = useRouter()
    // services
    const {sendUserLocation, getJobTitlesList, getIndustriesList} = useService()

    // GPS
    const [isGpsOn, setIsGpsOn] = useState(getCookie("isLocationSet") === "true");
    const [watchId, setWatchId] = useState(null);
    const lastSentTime = useRef(0);

    // selected tab
    const [tabKey, setTabKey] = useState("off")

    // selected industry and job_title
    const [selectedIndustry, setSelectedIndustry] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);

    // get industries and job-titles list
    const getIndustriesListResponse = getIndustriesList()
    const getJobTitlesListResponse = getJobTitlesList()

    // modals
    const [isIndustryModalOpen, setIndustryModalOpen] = useState(false);
    const [isJobTitleModalOpen, setJobTitleModalOpen] = useState(false);
    const [isUserInfoModalOpen, setIsUserInfoModalOpen] = useState(false)

    // nearby users
    const {data: nearbyUsers, isLoading, refetch: fetchNearbyUsers} = useQuery({
        queryKey: ["/v1/user/nearby-users"],

        queryFn: ({queryKey}) => {
            const baseUrl = queryKey[0];

            const params = new URLSearchParams();
            if (selectedJob) params.append("job_title_ids[]", selectedJob.id);
            if (selectedIndustry) params.append("industry_ids[]", selectedIndustry.id);

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
            fetchNearbyUsers()
        }
    }, [selectedIndustry, selectedJob]);

    // update gps status
    const updateGpsStatus = async (isGpsEnabled: boolean) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}/v1/user/gps-status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${getCookie("token")}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                is_gps_enabled: isGpsEnabled,
            }),
        });
    };

    const startTracking = () => {
        if (!navigator.geolocation) {
            toast.error('Your device does not support GPS.');
            setTabKey("off")
            setIsGpsOn(false)
            return;
        }

        const id = navigator.geolocation.watchPosition(
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
                    toast.error('Please enable GPS access.')
                } else {
                    toast.error('Error in retrieving location.' + error.message);
                }

                setTabKey("off")
                setIsGpsOn(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            }
        );

        // @ts-ignore
        setWatchId(id);
    };

    const stopTracking = () => {
        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setTabKey("off")
        }
    };

    useEffect(() => {
        if (isGpsOn) {
            updateGpsStatus(true);
            setCookie("isLocationSet", true);
            startTracking();
        } else {
            deleteCookie("isLocationSet");
            setTabKey("off");
            updateGpsStatus(false);
            stopTracking();
        }
    }, [isGpsOn]);

    // selected user
    const [selectedUser, setSelectedUser] = useState<any>()

    const onSubmitLocation: SubmitHandler<Location> = (data: any) => {
        sendUserLocation.mutate(data, {
            onSuccess: (response) => {
                fetchNearbyUsers()
            },
            onError: (error) => {
                setIsGpsOn(false)
                toast.error(error.message);
            }
        });
    };

    return (
        <div className={"w-full h-screen"}>
            <div className={"flex items-center justify-between px-5 py-3"}>
                <DrawerMenu setIsGpsOn={setIsGpsOn}/>
                {
                    isGpsOn &&
                    <Tabs aria-label="location"
                          onSelectionChange={(key: any) => {
                              if (key === "off") {
                                  setIsGpsOn(false)
                              }
                          }}
                          radius={"sm"} classNames={{tabList: "bg-primary",}}
                    >
                        <Tab key="on" title={<FaPowerOff/>} className={"px-5"}/>
                        <Tab key="off" title="off" className={"px-5"}/>
                    </Tabs>
                }
            </div>
            <div className={"h-[calc(100%-64px)] flex justify-center"}>
                {/* when location is off ... */}
                {
                    !isGpsOn &&
                    <div className={"h-full p-10 flex flex-col justify-center items-center gap-4"}>
                        <Image src={disabled_location_image} width={500} alt={"disabled location image"}/>
                        <div className={"font-black text-xl text-center w-full"}>Location sharing is
                            disabled.
                        </div>
                        <div className={"text-center"}>To find nearby people, please enable location
                            sharing.
                        </div>
                        <Tabs isDisabled={sendUserLocation.isPending}
                              aria-label="location"
                              defaultSelectedKey="off"
                              size={"lg"}
                              radius={"sm"}
                              selectedKey={tabKey}
                              onSelectionChange={(key: any) => {
                                  if (key === "on") {
                                      setIsGpsOn(true)
                                  } else {
                                      setIsGpsOn(false)
                                  }
                              }}
                        >
                            <Tab key="off" title="off" className={"px-10"}/>
                            <Tab key="on" title={<FaPowerOff/>} className={"px-10"}/>
                        </Tabs>
                    </div>
                }
                {isGpsOn && isLoading ?
                    <Spinner/>
                    : <>
                        {/* when not found user nearby ...*/}
                        {
                            isGpsOn && nearbyUsers?.data.length === 0 &&
                            <div className={"h-full p-14 flex flex-col justify-center items-center gap-4"}>
                                <Image src={no_user_found_image} width={500} alt={"no user found image"}/>
                                <div className={"font-black text-xl text-center w-full"}>No nearby user found</div>
                                <div className={"text-center"}>The system is automatically scanning for nearby
                                    users, and they will be displayed if found.
                                </div>
                                {
                                    (selectedIndustry !== null || selectedJob !== null)
                                    && <Button
                                        radius={"sm"}
                                        color={"primary"}
                                        className={"w-full"}
                                        onPress={() => {
                                            setSelectedIndustry(null)
                                            setSelectedJob(null)
                                        }}
                                    >
                                        clear filters
                                    </Button>
                                }
                            </div>
                        }

                        {/*when found user nearby ...*/}
                        {
                            isGpsOn && nearbyUsers?.data.length > 0 && (
                                <div
                                    className={"h-full p-4 bg-[#f9f9f9] w-full overflow-y-auto flex flex-col items-center gap-4"}>
                                    <Image src={users_image} alt={"users"}/>
                                    <div className={"font-black text-xl text-center w-full"}>Congratulations!</div>
                                    <div className={"text-center text-gray-600"}>
                                        The following people have been found near you. You can start a conversation with
                                        them by clicking on
                                        their profiles.
                                    </div>
                                    <div className={"w-full flex justify-between items-center gap-1"}>
                                        <input
                                            readOnly
                                            placeholder="Title job"
                                            className="form-input form-input-sm !m-0"
                                            value={selectedJob?.name || ""}
                                            onClick={() => setJobTitleModalOpen(true)}
                                        />
                                        <input
                                            readOnly
                                            placeholder="Industry"
                                            className="form-input form-input-sm !m-0"
                                            value={selectedIndustry?.name || ""}
                                            onClick={() => setIndustryModalOpen(true)}
                                        />
                                    </div>
                                    <div className={"grid grid-cols-2 gap-2.5 w-full"}>
                                        {nearbyUsers?.data.map((user: User) => (
                                            <div
                                                key={user.id}
                                                className={
                                                    "bg-white shadow-sm flex flex-col items-center justify-center gap-2 p-4 rounded-lg"
                                                }
                                            >
                                                <div
                                                    className={"w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"}>
                                                    <img alt={user.name} src={user.avatar}
                                                         className={"rounded-full h-full w-full"}/>
                                                </div>
                                                <div
                                                    className={"font-medium text-center text-gray-800 capitalize"}>{user.name}
                                                </div>

                                                <div
                                                    className={"text-xs text-gray-500 text-center"}>{user.job_title + " / " + user.industry}
                                                </div>

                                                <div className={"flex gap-1"}>
                                                    <Button size={'sm'} variant={"bordered"}
                                                            onPress={() => {
                                                                setSelectedUser(user)
                                                                setIsUserInfoModalOpen(true)
                                                            }}>
                                                        <IoDocumentTextOutline className={"text-lg"}/>
                                                    </Button>
                                                    <Button
                                                        onPress={() => router.push(`/chat/${user.id}?user=${encodeURIComponent(JSON.stringify(user))}`)}
                                                        size={"sm"}
                                                        variant={"bordered"}>
                                                        <SendIcon className={"text-black"}/>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                    </>
                }


            </div>
            {
                getIndustriesListResponse.data?.data && (
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
                )
            }

            {/* user info modal  */}
            <Modal placement={"center"} size={"xs"} isOpen={isUserInfoModalOpen} onOpenChange={setIsUserInfoModalOpen}>
                <ModalContent>
                    {(onCloseModal) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">user Info</ModalHeader>
                            <div
                                className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3"></div>
                            <ModalBody className={"p-3"}>
                                <div className="flex flex-col items-center gap-2.5">
                                    <div className={"h-16 w-16 border border-gray-200 rounded-full"}>
                                        <img src={selectedUser.avatar} alt={selectedUser.name}
                                             className={"rounded-full h-full w-full"}/>
                                    </div>
                                    <div className={"font-mono"}>{selectedUser.name}</div>
                                    <div className={"flex flex-col gap-4 text-xs w-full"}>
                                        <div className={"flex gap-2"}>
                                            <div className={"font-semibold w-[50%] p-1"}> industry:</div>
                                            <div className={"text-wrap"}>{selectedUser.industry}</div>
                                        </div>
                                        <div className={"flex gap-2"}>
                                            <div className={"font-semibold w-[50%] p-1"}> title job:</div>
                                            <div className={"text-wrap"}>{selectedUser.job_title}</div>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onPress={() => router.push(`/chat/${selectedUser.id}?user=${encodeURIComponent(JSON.stringify(selectedUser))}`)}
                                    className={"w-full mt-4"} color={"primary"}>
                                    <SendIcon/>Chat
                                </Button>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
