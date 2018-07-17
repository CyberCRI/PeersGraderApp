<template>
	<div>
			<div v-if="withId && !isAdmin">
				<read-activity></read-activity>
			</div>
			<div v-else>
				<notifications group="activity" />
				<div v-show="showStep === 1 " class="">
					<h2>Create activity 1/3</h2>
					<div class="field is-horizontal">
						<div class="field-label is-normal">
							<label class="label">Title</label>
						</div>
						<div class="field-body">
					    <div class="field">
					       <input v-model="activity.title" class="input" type="text" placeholder="Activity's title">
					    </div>		
						</div>
					</div>
					<div class="field is-horizontal">
					  <div class="field-label is-normal">
					    <label class="label">Guidelines</label>
					  </div>
					  <div class="field-body">
					    <div class="field">
					      <div class="control">
					        <textarea class="textarea" v-model="activity.guidelines" placeholder="Activity's guidelines"></textarea>
					      </div>
					    </div>
					  </div>
					</div>
					<div class="field is-horizontal">
						<div class="field-label is-normal">
							<label class="label">Sessions</label>
						</div>
						<div class="field-body">
					    <div class="field">
					       <input class="input" type="number" v-model="activity.sessions" placeholder="How many sessions will there be ?">
					    </div>		
						</div>
					</div>
				</div>
				<div v-show="showStep === 2 " class="">
					<h2>Create activity 2/3</h2>
					<participants-acitivity></participants-acitivity>
				</div>
				<div v-show="showStep === 3 ">
					<h2>Create activity 3/3</h2>
					<div class="field">
					  <label class="label">Name</label>
					  <div class="control">
					    <input class="input" type="text" v-model="activity.teacherName" placeholder="Your name">
					  </div>
					</div>

					<div class="field">
					  <label class="label">Email</label>
					  <div class="control has-icons-left">
					    <input class="input" type="email" placeholder="Email input" v-model="activity.teacherEmail">
					    <span class="icon is-small is-left">
					      <i class="fas fa-envelope"></i>
					    </span>
					  </div>
					</div>
				</div>
				<div class="modal" :class="{'is-active' :showModal}">
				  <div class="modal-background"></div>
				  <div class="modal-content">
				    <p>Activity : {{modalInfo.activityPath}}</p>
				    <p>Password : {{modalInfo.activityPassword}}</p>
				    <button @click="redirect" class="button">Alright</button>
				  </div>
				  <button @click="redirect" class="modal-close is-large" aria-label="close"></button>
				</div>
				<div id="stepper" class="container is-fluid">
					<div id="level">
						<p class="level-right">
								<a  v-if="showStep>1" @click="goStep(-1)" class="button level-item">
									Previous
								</a>
								<a  v-if="showStep<3" @click="goStep(1)" class="button level-item" :disabled="!checkFirstStepCompletion">
									Continue
								</a>
								<a  v-else @click="postActivity" class="button level-item" >
									<span v-if="activity.urlId!=undefined">Update</span>
									<span v-else>Save</span>
								</a>
								<a v-if="activity.urlId!=undefined" @click="delActivity" class="button level-item">
									Delete
								</a>
						</p>
					</div>
				</div>
			</div>
		
	</div>
</template>

<script>
	import axios from 'axios'
	import ActivityRead from '@/components/ActivityRead'
	import ActivityParticipants from '@/components/ActivityParticipants'

	import {mapState, mapActions} from 'vuex'

	export default {
		name : 'Activity',
		components:{
			'read-activity' : ActivityRead,
			'participants-acitivity' : ActivityParticipants
		},
		data(){
			return {
				showStep : 1,
				showModal: false,
				modalInfo : {
					activityPath : '',
					activityPassword : ''
				}
			};
		},
		computed : {
			...mapState('activity',{
      	activity : 'activity',
      	withId   : 'withId',
 				isAdmin  : 'isAdmin'
    	}),
    	...mapState('participants',{
      	errors : 'errors'
    	}),
			checkFirstStepCompletion(){
				return this.activity.title && this.activity.guidelines && this.activity.sessions;
			}
		},
		methods: {
			...mapActions('activity',{
      	setActivity:'setActivity',
      	resetActivitySession : 'resetActivitySession',
      	getAuthActivity : 'getAuthActivity',
      	setWithId:'setWithId',
      	lookForActivity: 'lookForActivity',
      	deleteActivity: 'deleteActivity'
    	}),
    	...mapActions('participants',{
      	setErrors : 'setErrors'
    	}),
    	delActivity()//put it back in store, change name
    	{
    		this.deleteActivity(this.activity.urlId);
    	},
			postActivity(){
				console.log('launch save');
				if(this.errors.length == 0){
					var vm = this;
					this.setActivity(this.activity).then(response=>{
						if(response.teacherPwd){
							vm.modalInfo.activityPath = 'http://localhost:5000/#/activity/'+this.activity.urlId,
							vm.modalInfo.activityPassword = response.teacherPwd;
							vm.showModal = true;
						}
					});

				}
			},
			goStep(i){
				this.showStep+=i;
			},
			redirect(){
				this.$router.push({path:'/activity/'+this.activity.urlId});
			}
		},
		beforeRouteUpdate (to, from, next) {
		  console.log('beforeRouteUpdate')
		  this.showStep = 1;
		  this.showModal = false;
		  if(!to.params.id){
		  	console.log('here in update');
		  	this.resetActivitySession();
		  	this.setErrors([]);
		  	console.log('reset ?');
		  } else {
		  	this.setWithId(true);
		  }
		  next()
		},
		beforeRouteEnter(to,from,next){

			console.log('to then from')
			console.log(to);
			console.log(from)
			

			if(!to.params.id){
				console.log('here in route')
				next((vm)=>{
					vm.showModal = false;
					console.log('before reset')
					vm.resetActivitySession();
					this.setErrors([]);
					console.log('after reset, has it reset')
				});
			} else {
				 next((vm)=>{
				 	vm.showModal = false;
					vm.setWithId(true);
					vm.lookForActivity(to.params.id)
				 });
			} 
			//else fetchData();
		}
	}
</script>

<style scoped>
	/*#stepper{
		position:fixed;
		top:85%;
	}*/

/*	.participants-label{
		display: flex;
		justify-content: space-around;
	}

	.row-participant{
		display: flex;
		align-items: center;
		justify-content: space-evenly;
		margin-bottom: 1em;
	}

	input,textarea {
		min-width: 90%;
		width: 90%
	}

	h2{
		text-align: center;
		margin: 1.2em auto;
		width: 20%;
		font-size: 2vh;
	}

	.add-participant{
		cursor: pointer;
	}

	.remove-participant{
		cursor: pointer;
	}*/

</style>