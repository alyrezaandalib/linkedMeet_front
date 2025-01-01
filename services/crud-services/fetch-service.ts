import connectionManager from "../conection-manager";

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
            if (typeof window !== "undefined") {
                window.location.href = "/sign-in";
            }
            throw new Error("Unauthorized access - Redirecting to sign-in");
        }

        if (!response.ok) {
            const errorData = await response.json();
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
