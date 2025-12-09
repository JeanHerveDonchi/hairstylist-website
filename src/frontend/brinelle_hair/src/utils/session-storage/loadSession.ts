export const loadSession = (sessionKey: string) : any => {
    return sessionStorage.getItem(sessionKey);
}