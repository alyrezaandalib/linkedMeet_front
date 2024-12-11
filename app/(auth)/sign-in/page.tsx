import Image from "next/image";
import Linkedin from "@/public/icons/linkedin";

export default function SignInPage() {
    return (
        <div className={"flex flex-col h-screen"}>
            <div
                className="text-center flex justify-center items-center text-3xl font-bold h-[15%] text-white">LinkedMeet
            </div>
            <div className="flex relative items-center h-[85%] justify-center">
                <div className={"w-[90%] bg-gray-500 h-full absolute bottom-0 rounded-3xl"}></div>
                <div
                    className="absolute flex flex-col gap-3.5 bottom-0 w-full h-[97.5%] max-w-md bg-white rounded-t-3xl shadow-lg p-8">

                    <div className={"flex flex-col gap-1.5"}>
                        <h2 className="text-2xl font-semibold text-black">Sign In</h2>
                        <p className="text-sm text-gray-400">Nearby People, New Conversations</p>
                    </div>

                    {/* Form */}
                    <form className={"flex flex-col gap-3"}>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700"
                                   htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="test@gmail.com"
                                className="form-input"
                            />
                        </div>

                        <div>
                            <label className="block !mb-0 text-sm font-medium ml-4 rtl:mr-4 text-gray-700"
                                   htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="form-input"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="keepLoggedIn"
                                className="form-checkbox text-black"
                            />
                            <label htmlFor="keepLoggedIn" className="mb-0 text-sm text-gray-600">
                                Keep me logged in
                            </label>
                        </div>

                        <p className="text-xs text-gray-400">By clicking Continue, you agree to MYAPP User
                            Agreement, Privacy Policy, and Cookie Policy.</p>

                        <button
                            type="submit"
                            className="w-full btn btn-primary mt-1"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* OR Divider */}
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-sm text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    {/* LinkedIn Login */}
                    <button
                        className="w-full flex items-center justify-center gap-1.5 border border-gray-300 py-4 px-4 rounded-lg hover:bg-gray-100"
                    >
                        <Linkedin/>
                        <span className="text-sm text-gray-600">Linkedin</span>
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm flex items-center gap-2  justify-center">
                        <p className="text-gray-400 ">
                            Dont Have Account?
                        </p>
                        <button className="border rounded-lg bg-gray-100 text-gray-600 px-2 py-1.5">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}