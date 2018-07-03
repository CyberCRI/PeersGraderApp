<template>
	<div class="content-pg">
		<div class="field">
		  <label class="label">Activity's Id</label>
		  <div class="control">
		    <input class="input" v-model="activityKey" type="text" placeholder="Text input">
		  </div>
		  <p v-if="errorMessage!=''" class="help is-error">{{errorMessage}}</p>
		</div>
		<div class="field">
		  <div class="control">
		    <button class="button is-link" @click="findActivity">Submit</button>
		  </div>
		</div>
	</div>
</template>

<script>
	import {mapState, mapActions} from 'vuex'

	export default {
		data(){
			return {
				errorMessage:'',
				activityKey:''
			};
		},
		computed : {
			...mapState('activity',{
      	userSession:'userSession'
    	})
		},
		methods : {
			...mapActions('activity',{
				resetActivitySession : 'resetActivitySession',
      	lookForActivity: 'lookForActivity'
    	}),
			findActivity(){
				console.log('looking for')
				console.log(this.activityKey)
				this.lookForActivity(this.activityKey).then(response=>{
					this.$router.push({path:`/activity/${response.url}`});
				}).catch(error=>{
					this.errorMessage = error;
				});
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				vm.resetActivitySession();
			});
		}
	}
</script>

<style>
	
</style>