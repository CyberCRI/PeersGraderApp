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
						<div class="level step-header">
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
					<div id="step2" v-show="showStep === 2">
						<div class="level step-header">
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
					<div id="step3" v-show="showStep === 3">
						<div class="level step-header">
							<div class="level-item has-text-centered">
								<div>
									<p class="heading is-capitalize has-text-white">Step 3 of 4 : grading grid</p>
									<h2 class="title is-italic has-text-white">What matters and how much ?</h2>
								</div>
							</div>
						</div>
						<rubric-activity></rubric-activity>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step4" v-show="showStep === 4 ">
						<div class="level step-header">
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
						</div>
					</div>

<!-- ---------------------------------------------------------------------- -->
					<div id="step5" v-show="showStep === 5">
					  <!-- class="modal" :class="{'is-active' :showModal}" -->
					  <div class="level step-header">
						<div class="level-item has-text-centered">
							<div>
								<p class="heading is-capitalize has-text-white">Oh, a light memo.<!-- Step "done", aka 5 on 4--></p>
								<h2 class="title is-italic has-text-white">Done ! </h2>
							</div>
						</div>
					  </div>
					    <div class="message is-danger step5-message">
					      <div class="message-header">
					        Important informations <button class="delete" @click="redirect" aria-label="close" ></button>
					      </div>
					      <div class="message-body has-text-black has-text-centeredz">
					        <p>You completed the creation and configuration of a peers grading activity successfully !</p>
					        <br>
					        <h3 class="title is-6">Where is my activity ? Can I edit it ?</h3>
					        <p>
					          <span class="icon"><i class="fas fa-pencil-alt fa-1x" aria-hidden="true"></i></span> You can edit participants, options and the rubric using this link & password.<br>
					          <span class="icon"><i class="fas fa-link fa-1x" aria-hidden="true"></i></span> Activity's link is : <a :href="modalInfo.activityPath">{{modalInfo.activityPath}}</a><br>
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
					<a v-if="(withId && isAdmin && modifyWill)" @click="deleteActiviy" class="button is-danger level-item">
						Delete
					</a>
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	import ActivityRead from '@/components/ActivityRead'
	import ActivityParticipants from '@/components/ActivityParticipants'
	import ActivityHeader from '@/components/ActivityHeader'
	import ActivityRubric from '@/components/ActivityRubric'

	import {mapState, mapActions} from 'vuex'

	export default {
		name : 'Activity',
		components:{ // components used, see template
			'activity-header': ActivityHeader, 
			'read-activity' : ActivityRead,
			'participants-acitivity' : ActivityParticipants,
			'rubric-activity': ActivityRubric
		},
		data(){ //method that contains all data for the component
			return {
				showStep : 1, //showStep used to define which component is displayed to the user as each steps has dedicated component
				showModal: false, //wether or not display the modal for the successful completion of the activity creation
				modalInfo : { // object to embody modal infos
					activityPath : '',
					activityPassword : ''
				}
			};
		},
		computed : { //properties dynamically evaluated and cached, no reevaluation unless changed
			...mapState('activity',{ // mapState method from vuex to bring properties from store to the component|since we have a modularized store, you have to specify from which module of the store the properties are from
      	activity : 'activity', // properties from store || activity is an object that carries the activity model from monfo
      	withId   : 'withId', // Used to determine wether or not to load reading mode or writing mode
 				isAdmin  : 'isAdmin',// Used to determine wether or not the user is the creator of the activity and therfore can
 				modifyWill : 'modifyWill' // ?
    	}),
    	...mapState('participants',{ // from module participant
      	errors : 'errors' // needed to check if we can pass step 2
    	}),
			checkFirstStepCompletion(){ //validation method for step 1
				return this.activity.title && this.activity.guidelines && this.activity.sessions;
				// if title,guidelines,sessions not falsy, returns true
			}
		},
		methods: {
			...mapActions('activity',{ //same as mapState for actions
      	setActivity:'setActivity', //save the activity to db
      	resetActivitySession : 'resetActivitySession',// reset activity
      	setWithId:'setWithId', //set withId property
      	lookForActivity: 'lookForActivity', // method to load activity data 
      	deleteActivity: 'deleteActivity'// method to deleteActivity
    	}),
    	...mapActions('participants',{
      	setErrors : 'setErrors' // method to set content of errors array for Activity participants
    	}),
			postActivity(){ //to save activity in db 
				console.log('launch save');
				if(this.errors.length == 0){
					
					this.setActivity().then(response=>{
						if(response.teacherPwd){
							this.modalInfo.activityPath = window.location.origin+`/#/activity/${this.activity.urlId}`,
							this.modalInfo.activityPassword = response.teacherPwd;
							this.showStep = 4;
							this.goStep(1);
						}
					});
				}
			},
			checkRubric(){ //check if rubrics are properly made.
				//if every rubrics' points matches their descriptors sum points, return true
         return this.activity.rubrics.every(r=>Number(r.points) === r.descriptors.reduce((a,d)=>a+Number(d.points),0));
      },
			goStep(i){ //function that updates showStep value 
				//perfect example of not willing to refine stuffs leads to utter nonsense.. redo stuff boys.
				if(this.showStep == 3){ // if it's step 3 (rubrics set up)
					if(this.checkRubric()) // if rubrics properly filled up
						this.showStep+=i; // go to next/precedent screen
					else {

						this.$notify({ // else notify user 
							group:'notifications',
							type:'error',
							title:'Points skill incoherence'
						});
					}//if it's not step 3 and showStep if above 0, we can go to the next/precedent screen as long as long as step 1 is not empty and step 2 is without errors
				} else if(this.showStep>=0 && this.showStep!=3 && this.checkFirstStepCompletion && this.errors.length==0){
					this.showStep+=i;
				}


			},
			redirect(){
				this.$router.push({path:'/activity/'+this.activity.urlId}); //bring the user to the activity created 
			}
		},
		beforeRouteUpdate (to, from, next) {//first function called in each components with that hook. this components being composed of other components, if this hook s present in those, the beforeRouteUpdate is also called
		  console.log('beforeRouteUpdate')
		  this.showStep = 1; //set step to 1
		  this.showModal = false; //set modal success to false
		  if(!to.params.id){ //if no id we want the activity to be cleaned/ made if the user started stuff and for some reason wanted reload page
		  	console.log('here in update');
		  	this.resetActivitySession();


		  if(to.query.title)// get the activity title from route /
		  	this.activity.title = to.query.title;


		  	this.setErrors([]);// empty errors in case of a reload 
		  	console.log('reset ?');
		  } else { // if theres an id, its load the activity based on the id to load Activity Read 
		  	this.setWithId(true);
		  	this.lookForActivity(to.params.id);//load activity state
		  }
		  next();
		},
		beforeRouteEnter(to,from,next){ // because we chose (certainly unwisely) to load everything from the router, there are some uses cases where beforeRouteUpdate is not called because it's called only on the first time the user navigates to the route/component. So to fix that, we used this hook. It's basically the same stuff as beforeRouteEnter, only from here, the this is not  to the component's vue instance, so we wrap the logic within the next function where it's accessible. 

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

  .nameonit{
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
		border: solid black 1px;
		background-size: 200px 200px;
   	background-image:  linear-gradient(to bottom,
     rgba(55,152,212,0.93) 0%,
     rgba(55,152,212,0.93) 100%),
     url("../../static/images/bg-school.png");
	}

	.form{
		border: solid 1px black;
		border-radius : 10px;
		padding: 2em;
		background: white;
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
</style>
