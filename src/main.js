// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue' //Vue instance
import App from './App' // Main component of application
import router from './router' // module for routing client-side. define which component is meant to be called depending on the url/route visited by user
import store from './store'  // module for maintain state across the web app
import Notifications from 'vue-notification'     // ? from a node module ! | yes a node module
import axios from 'axios'	//module allowing to make ajax calls to the server.

Vue.config.productionTip = false;      // ? how does this works | i dunno, it was from in the documentation code

console.log(Vue.config)               

Vue.prototype.$axios = axios; // add axios to Vue prototype, allowing to access axios as a member of the Vue instance and therefore use one instance of axios

Vue.use(Notifications);      // ? add the node module to the vue instance, typically being able to use as if it was a vue component of our own

/* eslint-disable no-new */
new Vue({
  el: '#app',                // main hook | the vue instance will manage everything that is inside the element #app (events/data binding ...)
  router,                    // router 
  store,                     // js modules | vuex store
  components: { App },       // html,js,css components
  template: '<App/>'         // ?
})
