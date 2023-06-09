export function setItem(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

export function getItem(key) {
    return JSON.parse(localStorage.getItem(key))
}
export function removeItem(key) {
    localStorage.removeItem(key)
}

export default {
    setItem,
    getItem,
    removeItem
}