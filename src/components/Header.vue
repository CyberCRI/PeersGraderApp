<template>
   <nav class="navbar has-shadow is-fixed-top">
        <div class="container">
            <div class="navbar-brand">
                <span id="peergraders-brand" class="navbar-item">
                    <img src="../../static/images/cri.png" alt="Peergraders : a peer review tool">
                    Peergraders
                </span>

                <div class="navbar-burger burger" data-target="navMenu">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>



            <div id="navMenu" class="navbar-menu">
               <div class="navbar-start">
                  <router-link to="/help" class="navbar-item" >
                     Help
                  </router-link>
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
                        <span class="icon" id="settings">
                        <i class="fas fa-cogs"></i>
                        </span>
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
   #peergraders-brand{
      color: #64b4c8;
   }

	#settings {
      color : #6496b9;
   }


</style>