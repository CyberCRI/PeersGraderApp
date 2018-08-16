<template>
	<div class="pg-container">
		<activity-header/>
		<div v-if="isRubricEmpty">
			<p>No rubric for this actvity. Cannot review</p>
		</div>
		<div v-else class="main-container">

			<div class="columns">
				<div class="column">
					<div v-if="!$route.params.reviewId" class="field">
					  <label class="label">Email</label>
					  <div class="control has-icons-left">
					    <input class="input" type="email" placeholder="Email input" v-model="emailParticipant">
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
						<div v-if="isReviewStarted" class="columns">
							<div class="column is-offset-4 is-4">
								<a @click="postReview" class="button level-item is-success" >
									<span>Save</span>
								</a>
							</div>
						</div>
				  	<article class="media">
						  <figure class="media-left is-vcentered-pg">
						    <p class="initials image is-64x64">
						      {{review.grader.name.split(' ').reduce((a,c)=>a+c[0],'')}}
						    </p>
						  </figure>
						  <div class="media-content">
						    <div class="columns">
						    	<div class="column is-12">
						    		<div class="level">
						    			<div class="level-left">
						    				Activity
						    			</div>
						    			<div class="level-right">
						    				{{activity.title}}
						    			</div>
						    	</div>
						    	<div class="level">
						    			<div class="level-left">
						    				Guidelines
						    			</div>
						    			<div class="level-right">
						    				{{activity.guidelines}}
						    			</div>
						    	</div>
						    	<div class="level">
						    			<div class="level-left">
						    				Reviewing
						    			</div>
						    			<div class="level-right">
						    				{{grader.reviewed[indexReviewed].group}} - {{grader.reviewed[indexReviewed].name}} - {{grader.reviewed[indexReviewed].email}}
						    			</div>
						    	</div>
						    </div>
						  </div>
						</div>
						</article>
				  </div>
				</div>
			</div>
			<div v-if="isReviewStarted" class="columns">
				<div v-if="indexReviewed>0" class="column">
					<div class="field">
					  <div class="control">
					    <button @click="showReview(indexReviewed-1)" class="button is-light">Previous</button>
					  </div>
					</div>
				</div>
				<div class="column is-6">
					<div class="field">
					  <div class="control">
					    <button :disabled="isThereNextReviewed" @click="showReview(indexReviewed+1)" class="button is-light" :class="{'is-right': indexReviewed>0}">Next</button>
					  </div>
					</div>
				</div>
			</div>
			<div v-if="isReviewStarted">
				<div v-for="(peer,h) in grader.reviewed" :key="h">
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
						<div class="panel">
							<div class="panel-heading">
								<div class="">
									{{skill.name}}
								</div>
							</div>
							<div class="panel-block hero is-light">
							  
							    <div v-for="(descriptor,j) in skill.skillDescriptors" :key="j" class="columns is-multiline v-centered">
							    	
							    	
							    	
										<div class="column is-10">
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
						</div>
				
			</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex';
	import ActivityHeader from '@/components/ActivityHeader'

	export default{
		name: 'Review',
		data(){
			return {
				emailParticipant : '',
				indexReviewed : 0,
				grader : {}
			};	
		},
		components : {
			'activity-header': ActivityHeader
		},
		computed : {
			...mapState('activity',{
				activity : 'activity',
				isRubricEmpty : 'isRubricEmpty'
			}),
			...mapState('review',{
				review : 'review',
				hasReview : 'hasReview',
				isReviewStarted : 'isReviewStarted'
			}),
			isThereNextReviewed(){
				if(this.review.grader.reviewed)
					return this.indexReviewed >= this.review.grader.reviewed.filter(x=>x.group!=this.review.grader.group).length-1;
				else return false;
			}
		},
		methods : {
			...mapActions('activity',{
				lookForActivity: 'lookForActivity',				
				setActivity : 'setActivity',
				getPlanning : 'getPlanning'
			}),
			...mapActions('review',{
				setIsReviewStarted : 'setIsReviewStarted',
				setReview : 'setReview',
				setHasPushedSave : 'setHasPushedSave',
				lookForReview : 'lookForReview',
				lookForReviewFromParticipant : 'lookForReviewFromParticipant',
				setShowNotificationSave : 'setShowNotificationSave'
			}),
			getGrader(participants,identifiant){
				return participants.find(c=>c.token == identifiant || c.email == identifiant);
			},
			saveReviewsBeforeHand(activity,token){

				var grader = this.getGrader(activity.participants, token || this.emailParticipant),
						vm = this;
				this.getPlanning().then(()=>{
					for(var reviewee of grader.reviewed){
						vm.grader = grader;
						vm.setHasPushedSave(true);
						vm.setShowNotificationSave(false);
						vm.postReview();
					}
				});
			},
			async startReview(activity,token){
				var grader = this.getGrader(activity.participants, token || this.emailParticipant);

				if(grader){
					await this.lookForReviewFromParticipant({
						activityUrlId : activity.urlId,
						grader : {email: grader.email}
					}).then(()=>{
						this.grader = this.review.grader;
						this.setIsReviewStarted(true);
					});

					if(!this.hasReview){
						this.saveReviewsBeforeHand(this.activity,this.emailParticipant);
						//this.getPlanning().then(()=>{
							this.emailParticipant = grader.email;
							this.setReview(this.getNewReview(activity,grader));
							this.grader = grader;
							this.setIsReviewStarted(true);
					//});
					}

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

				grader.reviewed = Array.from(grader.reviewed.filter(x=>x.group != grader.group));

				for(var peer of grader.reviewed)
					peer.skills = Array.from(skills);

				return {
					grader : grader,
					activityUrlId : activity.urlId
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
							acquired : false
						}
					}
				}

				return skills;
			},
			postReview(){
				this.setHasPushedSave(true);
				if(!this.review.urlId)
					this.setReview({
						grader : this.grader,
						activityUrlId : this.review.activityUrlId,
					}).then(()=>{
						this.grader = this.review.grader;
					});
				else{
				 	this.review.grader = this.grader;
				 	this.setReview(this.review);
				}
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
					if(to.query.ptoken){
						vm.startReview(vm.activity,to.query.ptoken);
					}
				}
			});
		},
		async beforeRouteUpdate(to,from,next){
			console.log('beforeRouteUpdate')
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
			else this.lookForActivity(to.params.id);
		}
	};
</script>

<style scoped>
	.is-vcentered-pg{
		align-self: center;
	}

	.initials {
		text-align: center;
    line-height: 3.75em;
    background: black;
    color: white;
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
		border: solid black 1px;
		background-size: 200px 200px;
   	background-image:  linear-gradient(to bottom,
     rgba(55,152,212,0.93) 0%,
     rgba(55,152,212,0.93) 100%),
     url("../../static/images/school-bg.png");
	}
</style>