const saveStateToSession = (state: object, sessionKey: string) => {
   
    sessionStorage.setItem(sessionKey, JSON.stringify(state))
}

export default saveStateToSession;