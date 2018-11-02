<template>
    <nav class="navbar bg-wood has-shadow is-fixed-top">
        <div class="container">
            <div class="navbar-brand">
                <div id="peersgrader-brand" class="navbar-item">
                    <img src="../../static/images/logo-cri-sq-textless.svg" alt="PeersGrader : create peers grading activities for your class.">
                    <span>PeersGrader</span>
                    <a href="http://github.com/CyberCRI/PeersGraderApp/issues" class="button is-small is-danger is-rounded">Alpha</a>
                </div>

                <div class="navbar-burger burger" data-target="navMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <div id="docs" class="navbar-item has-dropdown is-hoverable">
              <a class="navbar-link has-text-info">Docs/Help</a>

              <div class="navbar-dropdown has-text-info">
                <a class="navbar-item" href="">Overview</a>
                <router-link to="/help" class="navbar-item">In practice</router-link>
                <hr class="navbar-divider">
                <div class="navbar-item">v. 2018.11.03</div>
              </div>
            </div>
            <div id="navMenu" class="navbar-menu">
               <div class="navbar-start">
                  <div class="navbar-item">
                     <div class="control has-icons-left">
                       <div class="select">
                         <select>
                           <option selected>English</option>
                           <option>Français</option>
                         </select>
                       </div>
                       <span class="icon is-left">
                         <i class="fas fa-language"></i>
                       </span>
                     </div>
                  </div>
                </div>

                <div class="navbar-end">
                  <!-- <router-link to="/settings" class="navbar-item" >
                     <button class="button is-hoverable">
                        <span class="icon" id="settings"><i class="fas fa-cogs"></i></span>
                        <span>Settings</span>
                     </button>
                  </router-link> -->
                  <router-link to="/activity" class="navbar-item" >
                     <button class="button is-info is-hoverable">
                        Create a new activity
                     </button>
                  </router-link >
                </div>

            </div>
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
.bg-wood,
#docs *  { background: url("../../static/images/bg-wood.png") repeat; }

#peersgrader-brand > *,
#navMenu,
#docs {
  margin: 0em .6em 0em .6em;
}
#peersgrader-brand {
  color: #64b4c8;
}
/*
#settings {
  color : #6496b9;
} */
</style>
