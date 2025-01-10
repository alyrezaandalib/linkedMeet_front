import connectionManager from "../conection-manager";
import toast from "react-hot-toast";
import {deleteCookie} from "cookies-next";
import {redirect} from "next/navigation";

export async function createService(url: string, data: any): Promise<any> {
    try {
        const token = connectionManager();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (token && response.status === 401) {
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
        console.error("Error in createService:", error);
        throw error;
    }
}
