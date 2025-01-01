import refreshToken from './refresh-token';
import {getCookie} from "cookies-next";

export default function connectionManager() {

    const token = getCookie("token")

    // !token === null && refreshToken();

    return token;
}
