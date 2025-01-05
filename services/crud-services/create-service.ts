import connectionManager from "../conection-manager";
import toast from "react-hot-toast";

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

        if (response.status === 401) {
            if (typeof window !== "undefined") {
                window.location.href = "/sign-in";
            }
            toast.error("Unauthorized access - Redirecting to sign-in");
            throw new Error("Unauthorized access - Redirecting to sign-in");
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
