<template>
	<div>
		<div v-if="showPassword && withId">
			<notifications group="password" />
			<div class="content-pg">
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
		<div v-else>
			<div v-if="withId && canReadOnly">
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
					<div class="field is-horizontal">
						<div class="field-label is-normal">
							<label class="label">Presentations</label>
						</div>
						<div class="field-body">
					    <div class="field">
					       <input class="input" type="number" v-model="activity.presentations" placeholder="How many presentations per sessions will there be ?">
					    </div>		
						</div>
					</div>
				</div>
				<div v-show="showStep === 2 " class="content-pg">
					<h2>Create activity 2/2</h2>
					<div class="level participants-label">
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
					</div>				
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
								<a v-if="activity.urlId!=undefined" @click="deleteActivity" class="button level-item">
									Delete
								</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	//import store from '@/store/modules/activity'
	import ActivityRead from '@/components/ActivityRead'
	import {mapState, mapActions} from 'vuex'

	export default {
		name : 'Activity',
		components:{
			'read-activity' : ActivityRead
		},
		data(){
			return {
				password: '',
				showStep : 1,
				errorMessage : ''
			};
		},
		computed : {
			...mapState('activity',{
      	activity:'activity',
      	showPassword : 'showPassword',
      	canReadOnly : 'canReadOnly',
      	withId : 'withId',
      	userSession:'userSession'
    	}),
			checkFirstStepCompletion(){
				return this.activity.title && this.activity.guidelines && this.activity.sessions && this.activity.presentations;
			}
		},
		methods: {
			...mapActions('activity',{
      	saveActivity:'saveActivity',
      	resetActivitySession : 'resetActivitySession',
      	getAuthActivity : 'getAuthActivity',
      	setShowPassword: 'setShowPassword',
      	setWithId:'setWithId',
      	deleteActivity: 'deleteActivity'
    	}),
    	checkPassword(){
    		console.log('passed pwd')
    		console.log(this.password)
    		this.getAuthActivity(this.password).then(function(response){

    		});
    	},
    	deleteActivity()//put it back in store, change name
    	{
    		axios.delete('http://localhost:5001/activity/'+this.activity.urlId).then(response=>{
                if(response.data.success){

                    this.$notify({
                        group: 'activity',
                        title:'Activity deleted',
                        text: `This activity ${response.data.activity.title} have been deleted with success.`,
                        type : 'success'
                    });
                    console.log('there there')
                    this.resetActivitySession();
                    this.showStep = 1;
                    this.$router.push({path:'/activity'})
                }
            })
    	},
			postActivity(){
				console.log('launch save')
				this.saveActivity(this.activity);
			},
			addParticipant(i){
				this.activity.participants.splice(i+1,0,{
					firstname:'',
					name:'',
					email:'',
					role:''
				});
			},
			removeParticipant(i){
				if(this.activity.participants.length>1)
					this.activity.participants.splice(i,1);
			},
			goStep1(e){
				this.showStep = 1;
			},
			goStep2(e){
				if(!this.checkFirstStepCompletion) return;
				else this.showStep = 2;
			}
		},
		beforeRouteEnter(to,from,next){
			console.log('to then from')
			console.log(to);
			console.log(from)
			

			if(!to.params.id){
				console.log('here in route')
				next(vm=>{
					vm.resetActivitySession();
				});
			} else {
				 next(vm=>{
				 	vm.setShowPassword(true);
					vm.setWithId(true);
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