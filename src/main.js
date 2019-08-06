// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Notifications from 'vue-notification'     // ? from a node module !
import axios from 'axios'

Vue.config.productionTip = false;      // ? how does this works

console.log(Vue.config)

Vue.prototype.$axios = axios;

Vue.use(Notifications);      // ?

/* eslint-disable no-new */
new Vue({
  el: '#app',                // main hook
  router,                    // router
  store,                     // js modules
  components: { App },       // html,js,css components
  template: '<App/>'         // ?
})
