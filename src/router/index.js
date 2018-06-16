import Vue from 'vue'
import Router from 'vue-router'
import Activity from '@/components/Activity'
import ActivityRead from '@/components/ActivityRead'
import FindActivity from '@/components/FindActivity'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  	  path: '/',
  	  name : 'root',
  	  redirect:'/activity'
  	},
  	{
  		path: '/activity',
  		name:'createActivity',
  		component : Activity
  	},
    {
      path: '/activity/:id',
      name: 'updateActivity',
      component : Activity
    },
    {
      path: '/activity/:id',
      name: 'readActivity',
      component : ActivityRead
    },
    {
      path: '/find/activity',
      name:'findActivity',
      component: FindActivity
    }
  ]
});
