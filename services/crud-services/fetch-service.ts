import connectionManager from "../conection-manager";
import toast from "react-hot-toast";
import {deleteCookie} from "cookies-next";
import {redirect} from "next/navigation";

interface FetchServiceParams {
    url: string;
}

export async function fetchService({ url }: FetchServiceParams): Promise<any> {
    try {
        const token = connectionManager();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.status === 401) {
            deleteCookie("token");
            toast.error("Unauthorized access - Redirecting to sign-in");
            redirect("/sign-in");
        }

        if (!response.ok) {
            const errorData = await response.json();
            toast.error(errorData?.message || `HTTP Error: ${response.status}`);
            throw new Error(errorData?.message || `HTTP Error: ${response.status}`);
        }

        const contentType = response.headers?.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return response;
        }

        return await response.json();
    } catch (error) {
        console.error("Error in fetchService:", error);
        throw error;
    }
}
