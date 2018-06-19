<template>
	<div>
			<div v-if="withId && !isAdmin">
				<read-activity></read-activity>
			</div>
			<div v-else>
				<notifications group="activity" />
				<div v-show="showStep === 1 " class="content-pg">
					<h2>Create activity 1/2</h2>
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
					<!-- <div class="field is-horizontal">
						<div class="field-label is-normal">
							<label class="label">Presentations</label>
						</div>
						<div class="field-body">
					    <div class="field">
					       <input class="input" type="number" v-model="activity.presentations" placeholder="How many presentations per sessions will there be ?">
					    </div>		
						</div>
					</div> -->
				</div>
				<div v-show="showStep === 2 " class="content-pg">
					<h2>Create activity 2/2</h2>
					<participants-acitivity></participants-acitivity>
					<!--<div class="level participants-label">
						<label class="label">Participants</label>
					</div>
					<div v-for="(participant,i) in activity.participants" class="row-participant">
						<div class="">
					    <div class="field">
					       <input class="input" type="text" v-model="participant.firstname" placeholder="Participant's firstname">
					    </div>		
						</div>
						<div class="">
					    <div class="field">
					       <input class="input" type="text" v-model="participant.name" placeholder="Participant's name">
					    </div>		
						</div>
						<div class="">
					    <div class="field">
					       <input class="input" type="email" v-model="participant.email" placeholder="Participant's email">
					    </div>		
						</div>
						<div class="">
					    <div class="field">
					    	<div class="select">
						    	<select v-model="participant.role">
									  <option disabled value="">Participant's role</option>
									  <option>Student</option>
									  <option>Observator</option>
									  <option>Teacher</option>
									</select>
								</div>
					    </div>		
						</div>
						<div class="add-participant" v-on:click="addParticipant(i)">
							<i class="far fa-plus-square"></i>
						</div>
						<div class="remove-participant" @click="removeParticipant(i)">
							<i class="far fa-minus-square"></i>
						</div>
					</div> -->				
				</div>
				<div id="stepper" class="container is-fluid">
					<div id="level">
						<p class="level-right">
								<a  v-if="showStep === 2" @click="goStep1" class="button level-item">
									Previous
								</a>
								<a  v-if="showStep === 1" @click="goStep2" class="button level-item" :disabled="!checkFirstStepCompletion">
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
	//import store from '@/store/modules/activity'
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
				showStep : 1
			};
		},
		computed : {
			...mapState('activity',{
      	activity : 'activity',
      	withId   : 'withId',
 				isAdmin  : 'isAdmin'
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
    	delActivity()//put it back in store, change name
    	{
    		this.deleteActivity(this.activity.urlId);
    	},
			postActivity(){
				console.log('launch save');
				this.setActivity(this.activity);
			},
			goStep1(e){
				this.showStep = 1;
			},
			goStep2(e){
				if(!this.checkFirstStepCompletion) return;
				else this.showStep = 2;
			}
		},
		beforeRouteUpdate (to, from, next) {
		  console.log('beforeRouteUpdate')
		  this.goStep1();
		  if(!to.params.id){
		  	console.log('here in update');
		  	this.resetActivitySession();
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
					console.log('before reset')
					vm.resetActivitySession();
					console.log('after reset, has it reset')
				});
			} else {
				 next((vm)=>{
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

	.participants-label{
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
	}

</style>