export function startSession(userId) {
    sessionStorage.setItem('userId', userId)
}
export function getSession() {
    return sessionStorage.getItem('userId')
}
export function endSession() {
    sessionStorage.removeItem('userId');
}