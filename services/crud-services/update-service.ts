import connectionManager from "../conection-manager";

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
                window.location.href = '/sign-in';
            }
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
            throw new Error(error?.message || "An error has occurred.");
        }
    } catch (error) {
        console.error("error in updateService:", error);
        throw error;
    }
}
