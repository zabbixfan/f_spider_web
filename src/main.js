// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import Vuelazyload from 'vue-lazyload'
import 'normalize.css'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import './assets/main.css'

// 使用element-ui
Vue.use(ElementUI)

Vue.use(Vuelazyload, {
    loading: require('../static/file-picture-icon.png')
})

// 发布后是否显示提示
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {
        App
    }
})
