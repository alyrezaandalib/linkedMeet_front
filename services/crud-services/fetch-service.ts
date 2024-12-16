import connectionManager from "../conection-manager";

let isAlertShowing = false;

export async function fetchService(url: string) {
    const token = connectionManager();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        const error = new Error();

        if (!isAlertShowing) {
            isAlertShowing = true;
            console.error(error)
        }

        return error
    }

    const contentType = response?.headers?.get("content-type");

    if (contentType == null) {
        return response;
    } else {
        return await response.json();
    }
}
