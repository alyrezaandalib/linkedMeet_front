import {IoIosArrowBack} from "react-icons/io";
import Link from "next/link";

export default function AboutUsPage(){
    return (
        <div className={"px-4 pt-10"}>
            <div className="flex items-center px-2">
                <Link href={"/"} className="rounded-lg p-2 hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </Link>
                <h1 className="ml-2 text-lg font-bold">About Us</h1>
            </div>
            <div className={"leading-7 p-5 font-light text-gray-800"}>
                LinkedMeet allows you to significantly expand your network and connect with many people around you. Take the power of your connections to new heights.
            </div>
        </div>
    )
}