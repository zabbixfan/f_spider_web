import * as types from '../mutation-types'
import * as http from '../../http'
import api from '../../api'
import Cookies from 'js-cookie'

export default {
    state: {
        user: null,
        token: ''
    },
    getters: {
        userName: state => {
            return state.user ? state.user.name : ''
        },
        userMail: state => {
            return state.user ? state.user.email : ''
        },
        userRole: state => {
            return state.user ? state.user.role : ''
        },
        userLoginName: state => {
            return state.user ? state.user.loginName : ''
        },
        userId: state => {
            return state.user ? state.user.id : ''
        }
    },
    mutations: {
        [types.LoadUSER](state, user) {
            state.user = user
        },

        [types.LoadToken](state, token) {
            state.token = token
        }
    },
    actions: {
        setUserToken(context, data) {
            let token = data ? data.token : ''
            let func = data ? data.func : null
            context.commit(types.LoadToken, token)
            if (token) {
                // 用户登陆
                http.post(api.getUserByToken, {
                    accesstoken: token
                }).then(res => {
                    let user = res.data.data
                    if (user) {
                        context.commit(types.LoadUSER, user)
                        // Cookies.set('token', token)
                    } else {
                        context.dispatch('setUserToken', '')
                    }
                    if (func) {
                        func()
                    }
                })
            } else {
                // 用户退出
                Cookies.remove('token')
                context.commit(types.LoadUSER, null)
                // location.href = process.env.API_HOST + '/logout?appid=' + process.env.APP_ID + '&callback=' + encodeURI(process.env.LOCAL_HOST + '/%23')
                location.href = process.env.LOCAL_HOST + '/'
            }
        }
    }
}
