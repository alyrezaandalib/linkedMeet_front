import {IoIosArrowBack} from "react-icons/io";
import Link from "next/link";

export default function AboutUsPage(){
    return (
        <div className={"px-5 pt-4"}>
            <div className="flex items-center">
                <Link href={"/"} className="rounded-lg btn !shadow !p-2 !border-none hover:bg-gray-200">
                    <IoIosArrowBack className={"text-lg"}/>
                </Link>
                <h1 className="ml-2 text-lg font-bold">About Us</h1>
            </div>
            <div className={"leading-7 py-4 px-2 font-light text-gray-800"}>
                LinkedMeet allows you to significantly expand your network and connect with many people around you. Take the power of your connections to new heights.
            </div>
        </div>
    )
}