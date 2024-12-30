"use client"

import Image from "next/image";
import {Tab, Tabs} from "@nextui-org/tabs";
import service, {Location, User} from "./service"
import DrawerMenu from "@/components/layouts/drawer-menu";
import {useEffect, useState} from "react";
import {Spinner} from "@nextui-org/react";
import {Button} from "@nextui-org/button";
// images
import disabled_location_image from "../public/images/disabled_location.png"
import no_user_found_image from "../public/images/no_user_found.png"
import users_image from "../public/images/users.png"
// icons
import {FaPowerOff} from "react-icons/fa6";
import SendIcon from "@/public/tsx-icons/send";
import {IoDocumentTextOutline} from "react-icons/io5";


export default function Home() {

    const {onSubmitLocation, sendUserLocation} = service()
    const [location, setLocation]: any = useState("off")

    useEffect(() => {
        if (location === "on") {
            onSubmitLocation({
                latitude: "test",
                longitude: "test",
            })
        }
    }, [location]);

    // const {data, isPending, isError} = sendUserLocation
    const isPending = false
    // const data: any = []
    const data = [
        {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        }, {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        }, {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        }, {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        }, {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        }, {
            first_name: "ali",
            last_name: "andalib",
            job_title: "ui Designer",
            industry: "Front_end Developer",
            image: "none"
        },
    ]

    return (
        <div className={"w-full h-screen"}>
            <div className={"flex items-center justify-between px-5 py-3"}>
                <DrawerMenu/>
                {
                    location === "on" &&
                    <Tabs aria-label="location" onSelectionChange={setLocation} radius={"sm"} classNames={{
                        tabList: "bg-primary",
                    }}>
                        <Tab key="on" title={<FaPowerOff/>} className={"px-5"}/>
                        <Tab key="off" title="off" className={"px-5"}/>
                    </Tabs>
                }
            </div>
            <div className={"h-[calc(100%-64px)]"}>
                {
                    isPending ? <Spinner color={"primary"}/> :
                        <>
                            {/* when location is off ... */}
                            {
                                location === "off" &&
                                <div className={"h-full p-10 flex flex-col justify-center items-center gap-4"}>
                                    <Image src={disabled_location_image} width={500} alt={"disabled location image"}/>
                                    <div className={"font-black text-xl text-center w-full"}>Location sharing is
                                        disabled.
                                    </div>
                                    <div className={"text-center"}>To find nearby people, please enable location
                                        sharing.
                                    </div>
                                    <Tabs aria-label="location" size={"lg"} radius={"sm"}
                                          onSelectionChange={setLocation}>
                                        <Tab key="off" title="off" className={"px-10"}/>
                                        <Tab key="on" title={<FaPowerOff/>} className={"px-10"}/>
                                    </Tabs>
                                </div>
                            }
                            {/* when not found user nearby ...*/}
                            {
                                location === "on" && data.length === 0 &&
                                <div className={"h-full p-14 flex flex-col justify-center items-center gap-4"}>
                                    <Image src={no_user_found_image} width={500} alt={"no user found image"}/>
                                    <div className={"font-black text-xl text-center w-full"}>No nearby user found</div>
                                    <div className={"text-center"}>The system is automatically scanning for nearby
                                        users, and they will be displayed if found.
                                    </div>
                                </div>
                            }
                            {/* when found user nearby ...*/}
                            {
                                location === "on" && data.length > 0 && (
                                    <div
                                        className={"h-full p-4 bg-[#f9f9f9] w-full overflow-y-auto flex flex-col items-center gap-4"}>
                                        <Image src={users_image} alt={"users"}/>
                                        <div className={"font-black text-xl text-center w-full"}>Congratulations!</div>
                                        <div className={"text-center text-gray-600"}>
                                            The following people have been found near you. You can start a conversation with
                                            them by clicking on
                                            their profiles.
                                        </div>
                                        <div className={"w-full flex justify-between items-center gap-2"}>
                                            <input
                                                type="text"
                                                placeholder="Title job"
                                                className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Industry"
                                                className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                            />
                                            <select
                                                className="w-full p-2 border border-gray-300 rounded text-gray-700"
                                            >
                                                <option value="all">All</option>
                                                <option value="design">Design</option>
                                                <option value="development">Development</option>
                                            </select>
                                        </div>
                                        <div className={"grid grid-cols-2 gap-2.5 w-full"}>
                                            {data.map((user: User, index: number) => (
                                                <div
                                                    key={index}
                                                    className={
                                                        "bg-white shadow-sm flex flex-col items-center justify-center gap-2 p-4 rounded-lg border"
                                                    }
                                                >
                                                    <div
                                                        className={"w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center"}>
                                                            <span className="text-lg text-gray-600 font-semibold">
                                                                {user.first_name[0].toUpperCase() + user.last_name[0].toUpperCase()}
                                                            </span>
                                                    </div>
                                                    <div
                                                        className={"font-medium text-gray-800"}>{user.first_name + " " + user.last_name}
                                                    </div>

                                                    <div
                                                        className={"text-xs text-gray-500"}>{user.job_title + " / " + user.industry}
                                                    </div>

                                                    <div className={"flex gap-1"}>
                                                        <Button size={'sm'} variant={"bordered"}><IoDocumentTextOutline
                                                            className={"text-lg"}/></Button>
                                                        <Button size={"sm"} variant={"bordered"}><SendIcon
                                                            className={"text-black"}/></Button>
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
        </div>
    );
}