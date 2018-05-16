import Vue from 'vue'
import VueRouter from 'vue-router'
// import store from '../store'
// import Cookies from 'js-cookie'

Vue.use(VueRouter)

function load(component) {
    return () => System.import(`../views/${component}.vue`)
}

const router = new VueRouter({
    /*
     * NOTE! VueRouter "history" mode DOESN'T works for Cordova builds,
     * it is only to be used only for websites.
     *
     * If you decide to go with "history" mode, please also open /config/index.js
     * and set "build.publicPath" to something other than an empty string.
     * Example: '/' instead of current ''
     *
     * If switching back to default "hash" mode, don't forget to set the
     * build publicPath back to '' so Cordova builds work again.
     */

    routes: [
        // {
        //     path: '/',
        //     component: load('Index-layout'),
        //     navName: '首页',
        //     navIcon: 'fa-home',
        //     hasSub: false,
        //     children: [{
        //         path: '',
        //         component: load('index')
        //     }]
        // },
        {
            path: '/',
            component: load('Index-layout'),
            navName: '一房一价',
            navIcon: 'el-icon-search',
            hasSub: false,
            children: [{
                path: '',
                component: load('search/index')
            }]
        },
        {
            path: '/control/',
            component: load('Index-layout'),
            navName: '销控表',
            navIcon: 'el-icon-search',
            hasSub: false,
            children: [{
                path: '',
                component: load('search/control')
            }]
        },
        {
            path: '/login',
            component: load('login')
        },
        {
            path: '*',
            component: load('error/404')
        }
    ]
})
// const whiteList = ['/login']

// no redirect whitelist
// router.beforeEach((to, from, next) => {
//     if (store.state.account.token) {
//         next()
//     } else {
//         if (to.query.accesstoken) {
//             store.dispatch('setUserToken', {
//                 token: to.query.accesstoken,
//                 func: next
//             })
//             // store.dispatch('setUserToken', to.query.accesstoken)
//             // next()
//         } else if (Cookies.get('token')) {
//             store.dispatch('setUserToken', {
//                 token: Cookies.get('token'),
//                 func: next
//             })

//             // store.dispatch('setUserToken', Cookies.get('token'))
//             // next()
//         } else {
//             if (whiteList.indexOf(to.path) !== -1) {
//                 next()
//             } else {
//                 next('/login')
//             }
//         }
//     }
// })

export default router
