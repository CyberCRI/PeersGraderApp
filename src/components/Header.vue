<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
	  <div class="navbar-brand">
	    <span class="navbar-item" href="https://bulma.io">
	      <img src="../../static/images/CRI.png" alt="Centre de recherches interdisciplinaires">
	      PeerGraders
	    </span>
	    <router-link to="/activity" class="navbar-item" >
         Create new activity
      </router-link >
      <router-link to="/find/activity" class="navbar-item" >
         Find an activity
      </router-link >
      <router-link v-if="activity.urlId" :to="activityUrl+'/participants'" class="navbar-item" >
         Participants
      </router-link >
      <router-link v-if="activity.urlId" :to="activityUrl+'/planning'" class="navbar-item" >
         Planning
      </router-link >
      <router-link v-if="activity.urlId" :to="activityUrl+'/rubric'" class="navbar-item" >
         Rubric
      </router-link >
      <router-link v-if="activity.urlId" :to="activityUrl+'/review'" class="navbar-item" >
         Review
      </router-link >

	    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	    </a>
	  </div>
	</nav>
</template>

<script>
	import {mapState} from 'vuex'

	export default {
		computed : {
			...mapState('activity',{
      	activity : 'activity',
      	withId   : 'withId',
 				isAdmin  : 'isAdmin'
    	}),
      activityUrl(){
        return '/activity/'+this.activity.urlId;
      }
		}
	};	
</script>

<style scoped>
	


</style>