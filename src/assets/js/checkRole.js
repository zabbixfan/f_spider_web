export default {
    check(userRole, allowRole) {
        let user = new Set(userRole)
        let intersectionSet = new Set(allowRole.filter(x => user.has(x)))
        if (intersectionSet.size === 0) {
            return false
        } else {
            return true
        }
    }
}
