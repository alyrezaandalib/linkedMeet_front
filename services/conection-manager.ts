import tokenManager from './token-manager';
import refreshToken from './refresh-token';

export default function connectionManager() {

    const token = tokenManager();

    // @ts-ignore
    !token === null && refreshToken();

    return token;
}
