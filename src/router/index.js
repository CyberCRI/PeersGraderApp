import Vue from 'vue'
import Router from 'vue-router'
import Activity from '@/components/Activity'
import ActivityRead from '@/components/ActivityRead'
import FindActivity from '@/components/FindActivity'
import ActivityParticipants from '@/components/ActivityParticipants'
import Planning from '@/components/ActivityPlanning'
import ActivityRubric from '@/components/ActivityRubric'
import Review from '@/components/Review'
import Landing from '@/components/Landing'
import Dashboard from '@/components/Dashboard'

Vue.use(Router)

export default new Router({
  routes: [
  	{
  	  path: '/',
  	  name : 'root',
      component : Landing
  	},
  	{
  		path: '/activity/:id?',
  		name:'crudActivity',
  		component : Activity
  	},
    {
      path:'/activity/:id/review',
      name:'review',
      component: Review
    },
    {
      path:'/activity/:id/admin',
      name:'dashboard',
      component: Dashboard
    },
    {
      path:'/activity/:id/review/:reviewId',
      name:'crudReview',
      component:Review
    },
    {
      path: '/activity/:id/participants',
      name: 'activityParticipants',
      component : ActivityParticipants
    },
    {
      path: '/activity/:id/planning',
      name: 'activityPlanning',
      component : Planning
    },
    {
      path: '/activity/:id/rubric',
      name: 'activityRubric',
      component: ActivityRubric
    },
    {
      path: '/find/activity',
      name:'findActivity',
      component: FindActivity
    }
  ]
});
