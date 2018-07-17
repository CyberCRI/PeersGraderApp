<template>
	<div>
		<div class="">
			<div class="field">
			  <label class="label">Password</label>
			  <div class="control">
			    <input class="input" v-model="password" type="text" placeholder="Text input">
			  </div>
			  <p v-if="errorMessage!=''" class="help is-error">{{errorMessage}}</p>
			</div>
			<div class="field">
			  <div class="control">
			    <button class="button is-link" @click="checkPassword">Submit</button>
			  </div>
			</div>
		</div>
	</div>
</template>

<script>

	import {mapActions} from 'vuex'
	export default {
		data(){
			return {
				password: '',
				errorMessage : ''
			};
		},
		methods : {
			...mapActions('activity',{
	    	getAuthActivity : 'getAuthActivity',
	    }),
	    checkPassword(){
    		console.log('passed pwd')
    		console.log(this.password)
    		console.log('passed urlId',this.$store.state.activity.activity.urlId)
    		this.getAuthActivity({urlId:this.$store.state.activity.activity.urlId,pwd:this.password}).then(()=>{
    			this.$notify({
    				 group: 'notifications',
             title:'Access granted',
             type : 'success'
    			})
    		});
    	}
		}
	}
</script>

<style>
	
</style>