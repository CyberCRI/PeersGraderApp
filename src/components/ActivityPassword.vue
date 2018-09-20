<template>
	<div>
		<div class="field has-addons">
		  <div id="input-pwd" class="control">
		    <input class="input" type="text" placeholder="Enter your password" v-model="password">
		  </div>
		  <p v-if="errorMessage!=''" class="help is-error">{{errorMessage}}</p>
		  <div class="control">
		    <a class="button is-link" @click="checkPassword">
		      Get in !
		    </a>
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
		props : ['context'],
		methods : {
			...mapActions('activity',{
	    	getAuthActivity : 'getAuthActivity',
	    	setModifyWill : 'setModifyWill'
	    }),
	    checkPassword(){
    		console.log('passed pwd')
    		console.log(this.password)
    		console.log('passed urlId',this.$store.state.activity.activity.urlId)
    		this.getAuthActivity({urlId:this.$store.state.activity.activity.urlId,pwd:this.password}).then(response=>{
    			console.log('here',response)
    			if(response.granted){
	    			this.$notify({
	    				 group: 'notifications',
	             title:'Access granted',
	             type : 'success'
	    			});

	    			if(this.context == 'modify')
	    				this.setModifyWill(true)
	    			else this.setModifyWill(false);
	    		}
	    		else this.$notify({
	    				 group: 'notifications',
	             title:'Access not granted',
	             type : 'error'
	    			})
    		});
    	}
		}
	}
</script>

<style scoped>
	#input-pwd{
		width: 100%
	}
</style>