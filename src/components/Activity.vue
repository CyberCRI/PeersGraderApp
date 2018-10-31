<template>
	<div class="pg-container">
		<activity-header/>
		<div id="mainContainer" class="main-container column">
				<div v-if="withId && !modifyWill">
					<read-activity></read-activity>
				</div>
				<div v-else>

<!-- ---------------------------------------------------------------------- -->
					<div id="step1" v-show="showStep === 1 " class="">
						<div class="level">
							<div class="level-item has-text-centered">
								<div>
									<p class="heading is-capitalize has-text-white">Step 1 of 4</p>
									<h2 class="title is-italic has-text-white">What is your activity about ?</h2>
								</div>
							</div>
						</div>
						<div class="form">
							<div class="form-content">
								<div class="field is-horizontal">
									<div class="icon-label is-normal">
										<label class="label">
											<span class="icon is-large is-left">
							      		<i class="fas fa-pencil-alt"></i>
							    		</span>
										</label>
									</div>
									<div class="field-body">
								    <div class="field">
								       <input v-model="activity.title" class="input" type="text" placeholder="Activity's title">
								    </div>
									</div>
								</div>
								<div class="field is-horizontal">
								  <div class="icon-label is-normal">
								    <label class="label">
								    	<span class="icon is-large is-left">
							      		<i class="fas fa-chalkboard-teacher"></i>
							    		</span>
							  		</label>
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
									<div class="icon-label is-normal">
										<label class="label">
											<span class="icon is-large is-left">
							      		<i class="fas fa-stopwatch"></i>
							    		</span>
										</label>
									</div>
									<div class="field-body">
								    <div class="field">
								       <input class="input" type="number" min="1" v-model="activity.sessions" placeholder="How many sessions will there be ?">
								    </div>
									</div>
								</div>
							</div>
						</div>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step2" v-show="showStep === 2" class="">
						<div class="level">
							<div class="level-item has-text-centered">
								<div>
									<p class="heading is-capitalize has-text-white">Step 2 of 4</p>
									<h2 class="title is-italic has-text-white">Who is involve ?</h2>
								</div>
							</div>
						</div>
						<participants-acitivity></participants-acitivity>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step3" v-show="showStep ===3">
						<rubric-activity></rubric-activity>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step4" v-show="showStep === 4 ">
						<div class="level">
							<div class="level-item has-text-centered">
								<div>
									<p class="heading is-capitalize has-text-white">Step 4 of 4</p>
									<h2 class="title is-italic has-text-white">Who are you ?</h2>
								</div>
							</div>
						</div>
						<div class="name-on-it">
							<div class="field is-horizontal">
								<div class="icon-label is-normal">
									<label class="label">
										<span class="icon is-large is-left">
						      		<i class="fas fa-id-card-alt"></i>
						    		</span>
									</label>
								</div>
								<div class="field-body">
							    <div class="control step3">
							   		<input class="input" type="text" v-model="activity.teacherName" placeholder="Your name">
							  	</div>
								</div>
							</div>

							<div class="field is-horizontal">
								<div class="icon-label is-normal">
									<label class="label">
										<span class="icon is-large is-left">
						      		<i class="fas fa-envelope"></i>
						    		</span>
									</label>
								</div>
								<div class="field-body">
							    <div class="control step3">
								    <input class="input" type="email" placeholder="Email input" v-model="activity.teacherEmail" style="text-transform: lowercase">
								  </div>
								</div>
							</div>
							<!-- <div class="field">
							  <label class="label">Name</label>
							  <div class="control">
							    <input class="input" type="text" v-model="activity.teacherName" placeholder="Your name">
							  </div>
							</div> -->

							<!-- <div class="field">
							  <label class="label">Email</label>
							  <div class="control has-icons-left">
							    <input class="input" type="email" placeholder="Email input" v-model="activity.teacherEmail" style="text-transform: lowercase">
							    <span class="icon is-small is-left">
							      <i class="fas fa-envelope"></i>
							    </span>
							  </div>
							</div> -->
						</div>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step5" v-show="showStep === 5">
					  <!-- class="modal" :class="{'is-active' :showModal}" -->
					  <div class="level">
						<div class="level-item has-text-centered">
							<div>
								<p class="heading is-capitalize has-text-white">Oh, a light memo.<!-- Step "done", aka 5 on 4--></p>
								<h2 class="title is-italic has-text-white">Done ! </h2>
							</div>
						</div>
					  </div>
					    <div class="message is-danger">
					      <div class="message-header">
					        Important informations <button class="delete" @click="redirect" aria-label="close" ></button>
					      </div>
					      <div class="message-body has-text-black has-text-centeredz">
					        <p>You completed the creation and configuration of a peers grading activity successfully !</p>
					        <br>
					        <h3 class="title is-6">Where is my activity ? Can I edit it ?</h3>
					        <p>
					          <span class="icon"><i class="fas fa-pencil-alt fa-1x" aria-hidden="true"></i></span> You can edit participants, options and the rubric using this link & password.<br>
					          <span class="icon"><i class="fas fa-link fa-1x" aria-hidden="true"></i></span> Activity's link is : <a href="">{{modalInfo.activityPath}}</a><br>
					          <span class="icon"><i class="fas fa-key fa-1x" aria-hidden="true"></i></span> Master password is : {{modalInfo.activityPassword}}<br>

					        </p><br>
					        <h3 class="title is-6">How do I <i>really</i> start the activity with my participants ?</h3>
					        <p><span class="icon"><i class="fas fa-clock fa-1x" aria-hidden="true"></i></span> On D-day, gather your participants, identify additional or missing ones.<br>
					          <span class="icon"><i class="fa fa-users user-check fa-1x" aria-hidden="true"></i></span> Update the participants' list, thanks to the link & master password above.<br>
					          <span class="icon"><i class="fas fa-truck-monster fa-1x" aria-hidden="true"></i></span> Everyone's optimal planning is generated.<br>
					          <span class="icon"><i class="fas fa-paper-plane fa-1x" aria-hidden="true"></i></span> Send email invitations to all your participants instantly.<br>
					          <span class="icon"><i class="fas fa-hand-peace fa-1x" aria-hidden="true"></i></span> Enjoy ! Participants open the link, follow their missions, submiting evaluations as needed.
					        </p>
					        <br>
					        <p>A copy of these informations have been send to your email.</p><br>
					        <div @click="redirect" class="buttons is-centered"><span class="button is-danger">I took note!</span></div>
					      </div>
					    </div>
					    <!--  <button @click="redirect" class="modal-close is-large" aria-label="close"></button> -->
					</div>

				</div>
		</div>
		<div id="stepper-container">
			<div id="stepper">
				<p class="level-right">
					<a  v-if="showStep>1 && (!withId || (isAdmin && modifyWill)) && showStep < 5" @click="goStep(-1)" class="button level-item">
						<
					</a>
					<a  v-if="showStep<4 && (!withId || (isAdmin && modifyWill))" @click="goStep(1)" class="button level-item"
					:class="{'is-primary' : checkFirstStepCompletion}" :disabled="((!checkRubric() && showStep==3) || !checkFirstStepCompletion)">
						Continue
					</a>
					<a  v-if="showStep==4" @click="postActivity" class="button is-primary level-item" >
						<span v-if="activity.urlId!=undefined">Update</span>
						<span v-else>Save</span>
					</a>
					<a v-if="(withId && isAdmin && modifyWill)" @click="delActivity" class="button is-danger level-item">
						Delete
					</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import ActivityRead from '@/components/ActivityRead'
	import ActivityParticipants from '@/components/ActivityParticipants'
	import ActivityHeader from '@/components/ActivityHeader'
	import ActivityRubric from '@/components/ActivityRubric'

	import {mapState, mapActions} from 'vuex'

	export default {
		name : 'Activity',
		components:{
			'activity-header': ActivityHeader,
			'read-activity' : ActivityRead,
			'participants-acitivity' : ActivityParticipants,
			'rubric-activity': ActivityRubric
		},
		data(){
			return {
				showStep : 1,
				showModal: false,
				modalInfo : {
					activityPath : '',
					activityPassword : ''
				},
				APP_URL : ''
			};
		},
		computed : {
			...mapState('activity',{
      	activity : 'activity',
      	withId   : 'withId',
 				isAdmin  : 'isAdmin',
 				modifyWill : 'modifyWill'
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
							vm.modalInfo.activityPath = `https://peergraders.herokuapp.com/#/activity/${this.activity.urlId}`,
							vm.modalInfo.activityPassword = response.teacherPwd;
							vm.showStep = 4;
							this.goStep(1);
						}
					});
				}
			},
			checkRubric(){
         return this.activity.rubrics.every(r=>Number(r.points) === r.descriptors.reduce((a,d)=>a+Number(d.points),0));
      },
			goStep(i){

				if(this.showStep == 3){
					if(this.checkRubric())
						this.showStep+=i;
					else {

						this.$notify({
							group:'notifications',
							type:'error',
							title:'Points skill incoherence'
						});
					}
				} else if(this.showStep>=0 && this.showStep!=3 && this.checkFirstStepCompletion && this.errors.length==0){
					this.showStep+=i;
				}


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


		  if(to.query.title)
		  	this.activity.title = to.query.title;


		  	this.setErrors([]);
		  	console.log('reset ?');
		  } else {
		  	this.setWithId(true);
		  	this.lookForActivity(to.params.id);
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

					if(to.query.title)
						vm.activity.title = to.query.title


					vm.setErrors([]);

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
.step3{
	width: 100%;
}

.name-on-it{
	width: 70%;
	background: white;
	padding: 2em;
	border: 1px solid transparent;
	border-radius: 4px;
	margin: 0 auto;
}

.pg-container{
	height: auto;
	box-shadow: 0 1.5px 4px rgba(0,0,0,0.24), 0 1.5px 6px rgba(0,0,0,0.12);
	border-radius: 6px;
}

.main-container{
	padding-bottom: 60px;
	border: none;
	background-size: 200px 200px;
background-image:  linear-gradient(to bottom,
rgba(55,152,212,0.93) 0%,
rgba(55,152,212,0.93) 100%),
url("../../static/images/bg-school.png");
}

.form{
	border: solid 1px #dbdbdb;
	border-radius : 10px;
	padding: 2em;
	background: white;
	width: 80%;
	margin: 0 auto;
}
.message.is-danger { 
	width: 80%;
	margin: 0 auto;
}

.form-content{
	margin : 0 auto;
	width: 70%;
}

#stepper-container{
	z-index: 999999999;
	padding: 0.30em;
	/*border-right: solid 1px transparent;
	border-left:solid 1px transparent;
	border-bottom : solid 1px transparent;
	border-bottom-left-radius: 5px;
	border-bottom-right-radius: 5px;*/
}

.icon{
	color : #5d6e79;
	width: 32px;
	height: 32px;
}

.is-horizontal{
	align-items: center;
	margin-bottom: 1.5em;
	margin-top: 1.5em;
}

.icon-label {
	margin-right: 2%;
}

.row-participant > input{
	width: 30px;
}
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
