export const clearSessionFromKey = (sessionKey: string) => {
    sessionStorage.removeItem(sessionKey);
}