import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import Cookies from 'js-cookie'

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
        {
            path: '/',
            component: load('Index-layout'),
            navName: '首页',
            navIcon: 'fa-home',
            hasSub: false,
            children: [{
                path: '',
                component: load('index')
            }]
        },
        {
            path: '/system/',
            component: load('Index-layout'),
            navName: '系统管理',
            navIcon: 'fa-user-circle',
            hasSub: true,
            children: [{
                            path: 'jobs',
                            navName: '岗位管理',
                            component: load('system/jobs'),
                            hasSub: false
                        },
                        {
                            path: 'users',
                            navName: '用户列表',
                            component: load('system/users'),
                            hasSub: false
                        },
                        {
                            path: 'logs',
                            navName: '日志管理',
                            component: load('system/logs'),
                            hasSub: false
                        }
                    ],
            rule: ['superadmin']
        },
        {
            path: '/category/',
            component: load('Index-layout'),
            navName: '分类管理',
            navIcon: 'el-icon-setting',
            hasSub: false,
            children: [{
                path: '',
                component: load('categories')
            }],
            rule: ['superadmin', 'admin']
        },
        {
            path: '/article',
            component: load('Index-layout'),
            navName: '知识管理',
            navIcon: 'fa-book',
            hasSub: false,
            children: [
                {
                    path: '',
                    component: load('article/index')
                },
                {
                    path: 'create/',
                    component: load('article/create')
                },
                {
                    path: 'update/:id',
                    component: load('article/update')
                },
                {
                    path: ':id',
                    component: load('article/detail')
                }
            ],
            rule: ['superadmin', 'admin', 'auditor']
        },
        {
            path: '/search/',
            component: load('Index-layout'),
            navName: '知识库查看',
            navIcon: 'el-icon-search',
            hasSub: false,
            children: [{
                path: '',
                component: load('search/index')
            },
            {
                path: ':id',
                component: load('search/search-detail')
            }]
        },
        {
            path: '/test',
            component: load('test')
        },
        // {
        //     path: '/',
        //     component: load('Index-layout'),
        //     children: [
        //                 {
        //                     path: 'ticketlist/kibanaaccess/:id',
        //                     component: load('ticket/apply/kibanaaccess')
        //                 },
        //                 {
        //                     path: 'ticketlist/dcrecord/:id',
        //                     component: load('ticket/apply/dcrecord')
        //                 }
        //             ]
        // },
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
const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
    if (store.state.account.token) {
        next()
    } else {
        if (to.query.accesstoken) {
            store.dispatch('setUserToken', {
                token: to.query.accesstoken,
                func: next
            })
            // store.dispatch('setUserToken', to.query.accesstoken)
            // next()
        } else if (Cookies.get('token')) {
            store.dispatch('setUserToken', {
                token: Cookies.get('token'),
                func: next
            })

            // store.dispatch('setUserToken', Cookies.get('token'))
            // next()
        } else {
            if (whiteList.indexOf(to.path) !== -1) {
                next()
            } else {
                next('/login')
            }
        }
    }
})

export default router
