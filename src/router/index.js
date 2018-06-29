import Vue from 'vue'
import Router from 'vue-router'
import Activity from '@/components/Activity'
import ActivityRead from '@/components/ActivityRead'
import FindActivity from '@/components/FindActivity'
import ActivityParticipants from '@/components/ActivityParticipants'
import Planning from '@/components/ActivityPlanning'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  	  path: '/',
  	  name : 'root',
  	  redirect:'/activity'
  	},
  	{
  		path: '/activity/:id?',
  		name:'crudActivity',
  		component : Activity
  	},
    {
      path: '/activity/:id/participants',
      name: 'activityParticipants',
      component : ActivityParticipants
    },
    {
      path: '/activity/:id/Planning',
      name: 'activityPlanning',
      component : Planning
    },
    {
      path: '/find/activity',
      name:'findActivity',
      component: FindActivity
    }
  ]
});
