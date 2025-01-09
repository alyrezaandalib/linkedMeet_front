import connectionManager from "../conection-manager";
import toast from "react-hot-toast";
import {deleteCookie} from "cookies-next";

export async function updateService(url: string, data: any): Promise<any> {
    try {
        const token = connectionManager();

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 401) {
            if (typeof window !== "undefined") {
                deleteCookie("token");
                window.location.href = '/sign-in';
            }
            toast.error("Unauthorized access - Redirecting to sign-in");
            return null;
        }

        const contentType = response.headers?.get("content-type") || "";

        if (!contentType.includes("application/json")) {
            return response;
        }

        if (response.ok) {
            return await response.json();
        } else {

            const error = await response.json();
            toast.error(error?.message || "An error has occurred.");
            throw new Error(error?.message || "An error has occurred.");
        }
    } catch (error) {
        console.error("error in updateService:", error);
        throw error;
    }
}
