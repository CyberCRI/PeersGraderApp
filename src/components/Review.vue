<template>
	<div v-if="displayRedirection">
		<p>No rubric for this actvity. Cannot review</p>
	</div>
	<div v-else >
		<div class="columns">
			<div class="column">
				<div class="field">
				  <label class="label">Email</label>
				  <div class="control has-icons-left">
				    <input class="input" type="email" placeholder="Email input" v-model="emailParticipant">
				    <span class="icon is-small is-left">
				      <i class="fas fa-envelope"></i>
				    </span>
				  </div>
				  <p class="help">Enter the email id</p>
				</div>
				<div class="field">
				  <div class="control">
				    <button @click="startReview(activity)" class="button is-link">Submit</button>
				  </div>
				</div>
			</div>
		</div>
		<div v-if="isReviewStarted" class="columns">
			<div v-if="indexReviewed>0" class="column">
				<div class="field">
				  <div class="control">
				    <button @click="showReview(indexReviewed-1)" class="button is-link">Previous</button>
				  </div>
				</div>
			</div>
			<div class="column">
				<div class="field">
				  <div class="control">
				    <button :disabled="isThereNextReviewed" @click="showReview(indexReviewed+1)" class="button is-link">Next</button>
				  </div>
				</div>
			</div>
		</div>
		<div v-if="isReviewStarted">
			<a @click="postReview" class="button level-item" >
					<span>Save</span>
			</a>
			<div class="columns">
				<div class="column">
					<h1>Guidelines</h1>
					<p>{{activity.guidelines}}</p>
				</div>
			</div>
			<p>{{grader.reviewed[indexReviewed].group}} - {{grader.reviewed[indexReviewed].email}}</p>
			<div v-for="(peer,h) in grader.reviewed" :key="h">
				<div  v-if="h==indexReviewed" v-for="(skill,i) in peer.skills" :key="i" class="container is-fluid">
					<div  class="columns">
						<div class="column">
							<section class="hero is-info">
								<div class="hero-body">
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
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex';

	export default{
		name: 'Review',
		data(){
			return {
				emailParticipant : '',
				isReviewStarted : false,
				indexReviewed : 0,
				grader : {}
			};	
		},
		computed : {
			...mapState('activity',{
				activity : 'activity',
			}),
			...mapState('review',{
				review : 'review'
			}),
			displayRedirection(){
				return this.activity.rubrics.length == 1 && this.activity.rubrics[0].name == '' && this.activity.rubrics[0].points == 0
								&& this.activity.rubrics[0].descriptors.length == 1 && this.activity.rubrics[0].descriptors[0].content == 0 
								&& this.activity.rubrics[0].descriptors[0].points == 0;
			},
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
				setReview : 'setReview',
				setHasPushedSave : 'setHasPushedSave',
				lookForReview : 'lookForReview',
				lookForReviewFromParticipant : 'lookForReviewFromParticipant'
			}),
			getGrader(participants,identifiant){
				return participants.find(c=>c.token == identifiant || c.email == identifiant);
			},
			startReview(activity,token){
				var grader = this.getGrader(activity.participants, token || this.emailParticipant);

				if(grader){
					
					this.getPlanning().then(()=>{
						this.emailParticipant = grader.email;
						this.setReview(this.getNewReview(activity,grader));
						this.grader = grader;
						this.isReviewStarted = true;
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
				if(this.grader.reviewed[indexReviewed].urlId)
					this.$router.push({
						path:'/activity/'+this.review.activityUrlId+'/review/'+this.review.grader.reviewed[this.indexReviewed].urlId
					});
				else this.$router.push({path:'/activity/'+this.review.activityUrlId+'/review/'});
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
						reviewed : this.grader.reviewed[this.indexReviewed].email
					}).then(()=>{
						this.grader = this.review.grader;
					});
				else{
				 if(this.review.urlId == this.review.grader.reviewed[this.indexReviewed].urlId){
				 	this.review.grader = this.grader;
				 	this.setReview(this.review);
				 } else {
				 		this.setReview({
						grader : this.grader,
						activityUrlId : this.review.activityUrlId,
						reviewed : this.grader.reviewed[this.indexReviewed].email
					});
				 }
				}
			}
		},
		beforeRouteEnter(to,from,next){
			next(async vm=>{
				await vm.lookForActivity(to.params.id);

				if(to.params.reviewId){
					await vm.lookForReview({
						activityUrlId : to.params.id,
						urlId : to.params.reviewId
					});
					vm.grader = vm.review.grader;
					vm.emailParticipant = vm.review.grader.email;
					vm.isReviewStarted = true;
				} else {
					if(to.query.ptoken)
						vm.startReview(vm.activity,to.query.ptoken);
				}
			});
		},
		async beforeRouteUpdate(to,from,next){
			if(to.params.reviewId && to.params.reviewId != this.review.urlId){
				console.log('here i am :(')
				await this.lookForActivity(to.params.id)
				await this.lookForReview({
					activityUrlId : to.params.id,
					urlId : to.params.reviewId
				});
				this.grader = this.review.grader;
				this.emailParticipant = this.review.grader.email;
				this.isReviewStarted = true;
			}
			else this.lookForActivity(to.params.id);
		}
	};
</script>

<style >
	
</style>