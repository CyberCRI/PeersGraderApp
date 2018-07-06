import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'

import activity from './modules/activity'
import participants from './modules/participants'
import review from './modules/review'

Vue.use(Vuex);
Vue.use(VueRouter);

export default new Vuex.Store({
    modules : {
        activity,
        participants,
        review
    }
});