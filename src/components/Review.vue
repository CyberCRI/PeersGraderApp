<template>
	<div class="pg-container">
		<activity-header/>
		<div v-if="isRubricEmpty">
			<p>No rubric for this actvity. Cannot review</p>
		</div>
		<div v-else class="main-container bg-school">

			<div class="columns">
				<div class="column">
					<div v-if="!$route.params.reviewId" class="field">
					  <label class="label">Email</label>
					  <div class="control has-icons-left">
					    <input class="input" type="email" placeholder="Email input" v-model="emailParticipant" style="text-transform: lowercase">
					    <span class="icon is-small is-left">
					      <i class="fas fa-envelope"></i>
					    </span>
					    <p class="help">Enter the email id</p>
					  </div>
					  <div class="field">
						  <div class="control">
						    <button @click="startReview(activity)" class="button is-link">Submit</button>
						  </div>
						</div>
					</div>
					<div v-else>

				  	<article v-if="grader.email" class="media" id="review-info">
						  <figure class="media-left is-vcentered-pg">
						    <p class="initials image is-64x64">
						      {{review.grader.name.trim().split(' ').reduce((a,c)=>a+c[0],'')}}
						    </p>
						  </figure>
						  <div class="media-content" id="resume">
						    <div class="columns is-multiline">
						    	<div class="column is-2">
						    		<span class="has-text-weight-bold">Activity :</span>
						    	</div>
						    	<div class="column  is-9">
						    		{{activity.title}}
						    	</div>
						    	<div class="column is-2">
						    		<span class="has-text-weight-bold">Guidelines : </span>
						    	</div>
						    	<div class="column  is-9">
						    		{{activity.guidelines}}
						    	</div>
						    	<div class="column is-2">
						    		<span class="has-text-weight-bold">Reviewer :</span>
						    	</div>
						    	<div class="column  is-9">
						    		{{grader.name}} - {{grader.email}}
						    	</div>
						    	<div class="column is-2">
						    		<span class="has-text-weight-bold">Reviewing :</span>
						    	</div>
						    	<div class="column  is-9">
						    		{{grader.reviewed[indexReviewed].group}} - {{grader.reviewed[indexReviewed].name}} - {{grader.reviewed[indexReviewed].email}}
						    	</div>
						  	</div>
							</div>
						</article>
				  </div>
				</div>
			</div>
			<div v-if="isReviewStarted && grader.email" class="columns">



				<div class="column is-2">
					<div class="field">
					  <div class="control">
					    <button :disabled="indexReviewed<1" @click="showReview(indexReviewed-1)" class="button is-light">Previous</button>
					  </div>
					</div>
				</div>
				<div class="column is-7">
					<h3 class="title has-text-centered has-text-white">Step {{grader.reviewed[indexReviewed].session}} of {{review.sessionCount}}</h3>
				</div>
				<div class="column is-2">
					<a @click="postReview" class="button level-item is-success" >
						<span>Save</span>
					</a>
				</div>
				<div class="column is-1">
					<div class="field">
					  <div class="control">
					    <button :disabled="isThereNextReviewed" @click="showReview(indexReviewed+1)" class="button is-light is-right">Next</button>
					  </div>
					</div>
				</div>
			</div>
			<div v-if="isReviewStarted && grader.email && grader.group != grader.reviewed[indexReviewed].group">
				<div v-for="(peer,h) in review.grader.reviewed" :key="h">
					<!-- <div  v-if="h==indexReviewed" v-for="(skill,i) in peer.skills" :key="i" class="container is-fluid">
						<div  class="columns">
							<div class="column">
								<section class="hero is-info">
									<div class="hero-body">3
								    <h1 class="title">
								       {{skill.name}}
								     </h1>
								     <section class="hero is-light">
											<div class="hero-body">
												<div v-for="(descriptor,j) in skill.skillDescriptors" :key="j" class="columns">
													<div class="column">
														{{descriptor.content}}
													</div>
													<div class="column is-two">
														<label :for="'check'+h+i+j" class="checkbox is-pulled-right">
														  <input type="checkbox" :id="'check'+h+i+j"
														  v-model="grader.reviewed[h].skills[i].skillDescriptors[j].acquired">
														 	{{grader.reviewed[h].skills[i].skillDescriptors[j].acquired ?
														 	 'acquired' : 'not acquired'}}
														</label>
													</div>
												</div>
											</div>
										</section>
								  </div>
								</section>
							</div>
						</div>
					</div> -->
					<div  v-if="h==indexReviewed" v-for="(skill,i) in peer.skills" :key="i" >
						<div class="panel skill">
							<div class="panel-heading">
								<div class="card-toggle" @click="accordion">
									{{skill.name}}
								</div>
							</div>
							<div class="panel-block hero is-light">

							    <div v-for="(descriptor,j) in skill.skillDescriptors" :key="j" class="subskill">

							    		<div class="columns">
							    			<div class="column is-9">
							    				{{descriptor.content}}
							    			</div>
							    			<div class="column is-3 is-flexin">
							    				<div class="slider">
							    					<vue-slider
							    					formatter="{value} %"
												    ref="slider"
												    v-model="descriptor.percentageAcquired">
												    </vue-slider>
												</div>
												<div class="elt">
												  <div>{{descriptor.percentageAcquired || 0}}</div>
												</div>
							    			</div>
							    		</div>
										   <!--  <div class="header">

															<label :for="'check'+h+i+j" class="checkbox is-pulled-right">
															  <input type="checkbox" :id="'check'+h+i+j"
															  v-model="grader.reviewed[h].skills[i].skillDescriptors[j].acquired">
															 	{{grader.reviewed[h].skills[i].skillDescriptors[j].acquired ?
															 	 'acquired' : 'not acquired'}}
															</label>

										    </div> -->





							  	</div>

							</div>
						</div>

			</div>
				</div>
			</div>
			<div v-else>
				<div class="columns">
					<div class="column is-12">
						<h3 class="title has-text-centered has-text-white is-uppercase">This session : you're presenting</h3>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex';
	import ActivityHeader from '@/components/ActivityHeader'
	import vueSlider from 'vue-slider-component'


	export default{
		name: 'Review',
		data(){
			return {
				emailParticipant : '',
				indexReviewed : 0,
				grader : {}
       /* options: {
	        eventType: 'auto',
	        width: 'auto',
	        height: 6,
	        dotSize: 16,
	        dotHeight: null,
	        dotWidth: null,
	        min: 0,
	        max: 100,
	        interval: 1,
	        show: true,
	        speed: 0.5,
	        disabled: false,
	        piecewise: false,
	        piecewiseStyle: false,
	        piecewiseLabel: false,
	        tooltip: false,
	        tooltipDir: 'top',
	        reverse: false,
	        data: null,
	        clickable: true,
	        realTime: false,
	        lazy: false,
	        formatter: null,
	        bgStyle: null,
	        sliderStyle: null,
	        processStyle: null,
	        piecewiseActiveStyle: null,
	        piecewiseStyle: null,
	        tooltipStyle: null,
	        labelStyle: null,
	        labelActiveStyle: null
	      }*/
			};
		},
		components : {
			'activity-header': ActivityHeader,
			'vue-slider': vueSlider
		},
		computed : {
			...mapState('activity',{
				activity : 'activity',
				isRubricEmpty : 'isRubricEmpty',
				shifts : 'shifts'
			}),
			...mapState('review',{
				review : 'review',
				hasReview : 'hasReview',
				isReviewStarted : 'isReviewStarted'
			}),
			isThereNextReviewed(){
				if(this.review.grader.reviewed)
					return this.indexReviewed >= this.review.grader.reviewed.length-1;
				else return false;
			}
		},
		methods : {
			accordion(e){
				e.currentTarget.parentElement.parentElement.childNodes[2].classList.toggle('is-hidden');
			},
			...mapActions('activity',{
				lookForActivity: 'lookForActivity',
				setActivity : 'setActivity',
				getPlanning : 'getPlanning'
			}),
			...mapActions('review',{
				resetReview : 'resetReview',
				setIsReviewStarted : 'setIsReviewStarted',
				setReview : 'setReview',
				setHasPushedSave : 'setHasPushedSave',
				lookForReview : 'lookForReview',
				lookForReviewFromParticipant : 'lookForReviewFromParticipant',
				setShowNotificationSave : 'setShowNotificationSave'
			}),
			getGrader(participants,identifiant){

				var looking = identifiant ? identifiant != '' ? identifiant : this.emailParticipant : this.emailParticipant;
				console.log('looking')
				console.log(looking)
				return participants.find(c=>c.token == looking || c.email == looking);
			},
			async saveReviewsBeforeHand(activity,token){
				console.log('activity')
				console.log(activity.participants)
				console.log(this.emailParticipant)
				var grader = this.getGrader(activity.participants, token || this.emailParticipant),
						vm = this;
						console.log('saveReviewsBeforeHand')
						console.log(activity,token)
						console.log('grader here')
						console.log(grader)
				return this.getPlanning().then(()=>{
					vm.review.sessionCount = vm.shifts.length;

					//grader.reviewed = Array.from(grader.reviewed.filter(x=>x.group != grader.group));
					vm.grader = grader;
					vm.setHasPushedSave(false);
					vm.setShowNotificationSave(false);
					vm.setReview(vm.getNewReview(activity,grader))
					vm.postReview();

				});
			},
			async startReview(activity,token){
				var grader = this.getGrader(activity.participants, token || this.emailParticipant);

				console.log('grader THERE')
						console.log(grader)


				if(grader){

					this.emailParticipant = grader.email;

					await this.lookForReviewFromParticipant({
						activityUrlId : activity.urlId,
						grader : {email: grader.email}
					}).then(()=>{
						console.log('????????')
						if(!this.hasReview){
							console.log('NO REVIEW ?')
							this.saveReviewsBeforeHand(this.activity,this.emailParticipant).then(()=>{
								this.emailParticipant = grader.email;
								//this.setReview(this.getNewReview(activity,grader));
								this.grader = grader;
								this.setIsReviewStarted(true);
							});
							//this.getPlanning().then(()=>{

						//});
						} else {
							this.grader = this.review.grader;
							this.setIsReviewStarted(true);
						}

					});



				} else {
					this.$notify({
						group : 'notifications',
						type : 'error',
						title : 'wrong credentials'
					})
				}
			},
			showReview(indexReviewed){
				this.indexReviewed = indexReviewed > this.review.grader.reviewed.length ?
																this.review.grader.reviewed.length : indexReviewed;
			},
			getNewReview(activity,grader){
				var skills = this.getEmptySkillTable(activity.rubrics);

				//grader.reviewed = Array.from(grader.reviewed.filter(x=>x.group != grader.group));

				for(var peer of grader.reviewed)
					peer.skills = Array.from(skills);

				return {
					grader : grader,
					activityUrlId : activity.urlId,
					sessionCount : this.review.sessionCount
				};
			},
			getEmptySkillTable(rubrics){
				var skills = new Array(rubrics.length);

				for(var i=0;i<rubrics.length;i++){
					skills[i] = {
						rubricId: rubrics[i]._id,
						name: rubrics[i].name,
            totalPossiblePoints: rubrics[i].points,
            skillDescriptors: new Array(rubrics[i].descriptors.length)
					};

					for(var j=0;j<rubrics[i].descriptors.length;j++){
						skills[i].skillDescriptors[j] = {
							content : rubrics[i].descriptors[j].content,
							descriptorId : rubrics[i].descriptors[j]._id,
							possiblePoints : rubrics[i].descriptors[j].points,
							acquired : false,
							percentageAcquired : 0
						}
					}
				}

				return skills;
			},
			postReview(){

				/*if(!this.review.urlId)
					this.setReview({
						grader : this.grader,
						activityUrlId : this.review.activityUrlId,
					}).then(()=>{
						this.grader = this.review.grader;
					});
				else{*/
					this.setHasPushedSave(true);
					this.setShowNotificationSave(false);
				 	//this.review.grader = this.grader;
				 	this.setReview(this.review);
				//}
			}
		},
		beforeRouteEnter(to,from,next){
			console.log('beforeRouteEnter')
			next(async vm=>{

				await vm.lookForActivity(to.params.id);

				if(to.params.reviewId){

					await vm.lookForReview({
						activityUrlId : to.params.id,
						urlId : to.params.reviewId
					}).then(()=>{
						vm.grader = vm.review.grader;
						console.log('here',vm.review.grader);
						console.log('here',vm.grader);
						vm.emailParticipant = vm.review.grader.email;
						vm.setIsReviewStarted(true);
					});

				} else {
					vm.resetReview();
					vm.indexReviewed = 0;
					vm.grader = {};
					vm.emailParticipant = '';
				}

				if(to.query.ptoken){
						vm.startReview(vm.activity,to.query.ptoken);
				}
			});
		},
		async beforeRouteUpdate(to,from,next){
			console.log('beforeRouteUpdate')
			//this.resetReview();
			if(to.params.reviewId){

				await this.lookForActivity(to.params.id)
				await this.lookForReview({
					activityUrlId : to.params.id,
					urlId : to.params.reviewId
				}).then(()=>{
					this.grader = this.review.grader;
					console.log('theree ',this.grader)
					console.log('there',this.review.grader);
					this.emailParticipant = this.review.grader.email;
					this.setIsReviewStarted(true);
				});

			}
			else {
				await this.lookForActivity(to.params.id);
				//this.resetReview();
				this.indexReviewed = 0;
				this.grader = {};
				this.emailParticipant = '';
			}

			if(to.query.ptoken){
				this.startReview(this.activity,to.query.ptoken);
			}
		}
	};
</script>

<style scoped>
	#review-info{
		padding: 2em;
		background: white;
		border: solid 1px white;
		border-radius: 6px;
	}

	.is-flexin{
		display: flex;
	}
	.slider{
		width: 80%;
	}
	.subskill{
		margin-top: 10px;
	}
	.subskill+.subskill,.skill+.skill{
		margin-top: 40px;
	}

	.collapsing {
        transition: height .35s ease;
    }

    .collapse:not(.show) {
        display: none;
    }

	.is-vcentered-pg{
		align-self: center;
	}

	.initials {
		text-align: center;
    line-height: 3.75em;
    background: black;
    color: white;
    border-radius: 50%;
	}

	.is-right {
		float:right;
	}

	.pg-container{
    height: auto;
    box-shadow: 0 1.5px 4px rgba(0,0,0,0.24), 0 1.5px 6px rgba(0,0,0,0.12);
    border-radius: 6px;
  }

	.main-container{
		padding: 1em;
	}
	.bg-wood { background: url("../../static/images/bg-wood.png") repeat; }

	.bg-school{
		background-size: 200px 200px;
		background-image:  linear-gradient(to bottom,
		 rgba(55,152,212,0.93) 0%,
		 rgba(55,152,212,0.93) 100%),
		 url("../../static/images/bg-school.png");
	}

</style>
