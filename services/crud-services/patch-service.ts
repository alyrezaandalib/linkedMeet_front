import connectionManager from "../conection-manager";

let isAlertShowing = false;

export async function patchService(url:string, data:any) {
    const token = connectionManager();

    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_API}${url}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify(data) // Convert the data to a JSON string
    });

    if (!response.ok) {
        const error = new Error();

        if (!isAlertShowing) {
            isAlertShowing = true;
            console.error(error)
        }

        return error;
    }

    const contentType = response?.headers?.get("content-type");

    if (contentType == null) {
        return response;
    } else {
        return await response.json();
    }
}
