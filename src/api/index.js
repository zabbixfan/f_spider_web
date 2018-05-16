const Host = process.env.API_HOST

export default {
    requestLogin: Host + '/login/',
    getUserByToken: Host + '/userinfo/',
    houses: Host + '/houses/',
    housename: Host + '/housename/',
    buildname: Host + '/buildname/',
    searchfilter: Host + '/searchfilter/'
}
