import connectionManager from "../conection-manager";

let isAlertShowing = false;

export async function updateService(url: string, data: any) {
    const token = connectionManager();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
        method: "PUT", // Change to PUT for full updates
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify(data) // Convert the data to a JSON string
    });

    if (!response.ok) {
        const error = new Error();

        try {
            error.message = await response.json();
        } catch (e) {
            error.message = "An error occurred while processing the response.";
        }

        if (!isAlertShowing) {
            isAlertShowing = true;
            console.error(error)
        }

        return null; // Return null in case of error for clarity
    }

    const contentType = response?.headers?.get("content-type");

    if (contentType == null) {
        return response;
    } else {
        return await response.json();
    }
}
