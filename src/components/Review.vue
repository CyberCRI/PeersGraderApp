<template>
	<div>
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
						    <button @click="isParticipant()" class="button is-link">Submit</button>
						  </div>
						</div>
					</div>
				</div>
				<div v-if="isGrader" class="columns">
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
				<div class="columns">
					<div class="column">
						<img v-if="loader"  src="../../static/images/loader.gif">
					</div>
				</div>

				<div v-if="identified">
					<a @click="postReview" class="button level-item" >
							<span>Save</span>
					</a>
					<div class="columns">
						<div class="column">
							<h1>Guidelines</h1>
							<p>{{activity.guidelines}}</p>
						</div>
					</div>
					<p>{{review.reviewed.group}} - {{review.reviewed.email}}</p>
					<div v-for="(rubric,i) in activity.rubrics" :key="i" class="container is-fluid">
						<div class="columns">
							<div class="column">
								<section class="hero is-info">
									<div class="hero-body">
								    <h1 class="title">
								        {{rubric.name}}
								     </h1>
								     <section class="hero is-light">
											<div class="hero-body">
												<div v-for="(descriptor,j) in rubric.descriptors" class="columns">
													<div class="column">
														{{descriptor.content}}
													</div>
													<div class="column is-two">
														<label class="checkbox is-pulled-right">
														  <input type="checkbox" v-model="review.skills[i].skillDescriptors[j].acquired">
														 	{{review.skills[i].skillDescriptors[j].acquired ? 'acquired' : 'not acquired'}}
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
		name:'Review',
		data(){
			return {
				isGrader : false,
				indexReviewed : -1,
				hasGraderParam : false,
				reviewId: null,
				emailParticipant : '',
				loader : false,
				identified : false,
			};
		},
		computed:{
			isThereNextReviewed(){
				if(this.review.grader.reviewed)
					return this.indexReviewed >= this.review.grader.reviewed.filter(x=>x.group!=this.review.grader.group).length-1;
				else return false;
			},
			...mapState('activity',{
				activity: 'activity'
			}),
			...mapState('review',{
				review:'review',
				hasReview : 'hasReview',
				hasPushedSave:'hasPushedSave'
			}),
			displayRedirection(){
				return this.activity.rubrics.length == 1 && this.activity.rubrics[0].name == '' && this.activity.rubrics[0].points == 0
								&& this.activity.rubrics[0].descriptors.length == 1 && this.activity.rubrics[0].descriptors[0].content == 0 
								&& this.activity.rubrics[0].descriptors[0].points == 0;
			}
		},
		methods:{
			...mapActions('activity',{
				lookForActivity: 'lookForActivity',
				getPlanning : 'getPlanning',
				setActivity : 'setActivity'
			}),
			...mapActions('review',{
				setReview : 'setReview',
				resetReview : 'resetReview',
				setHasPushedSave : 'setHasPushedSave',
				lookForReview : 'lookForReview',
				lookForReviewFromParticipant : 'lookForReviewFromParticipant'

			}),
			isParticipant(){
				var index = this.activity.participants.findIndex(c=>c.email == this.emailParticipant),
						grader = index > - 1 ? this.activity.participants[index] : null,
						vm = this;


				if(grader){
					// à voir/revoir avec vue discord promise et le populate grader aussi
					this.getPlanning().then(async response=>{
						vm.review.grader = grader;
						await vm.lookForReviewFromParticipant(vm.review);
						
						if(!this.hasReview){
							vm.activity.participants.map(x=>x.reviewed.map(c=>{if(c.graded)return;else c.graded = false;return c}));
							await vm.setActivity(vm.activity);
							vm.review.grader = grader;
							await vm.setReview(vm.review);
						}
					
						vm.isGrader = true;

						if(vm.indexReviewed == -1 && !this.review.grader.reviewed[0].urlId) vm.showReview(vm.indexReviewed+1);
						else {
							let indexReviewed = this.review.grader.reviewed.findIndex(c=>c.urlId == this.reviewId);
							vm.showReview(indexReviewed);
						}
						console.log('hererererer')
					}).catch(error=>{console.log('error',error)});


				} else {
					this.$notify({
						group : 'notifications',
						title : 'Wrong credentials',
						message : 'Email provided is not bind to this activity',
						type : 'error'
					});
				}
			},
			showReview(indexReviewed){
				
				console.log('rerezgegzegzegzeg')
					let reviewed = [],
							vm=this;
				//if(this.reviewId){
				
				//} else {
					console.log('i')
					console.log('grader',vm.review);
					reviewed = vm.review.grader.reviewed.filter(x=>Number(x.group) != Number(vm.review.grader.group));
					console.log('am')
					this.indexReviewed = indexReviewed > reviewed.length ? reviewed.length : indexReviewed;
					console.log('fed')
					this.review.reviewed = reviewed[this.indexReviewed];
					this.review.grader.reviewed = reviewed;
					
					if(!this.review.reviewed.urlId){
						delete this.review.__v;
						delete this.review._id;
						delete this.review.createdAt;
						delete this.review.updatedAt;
						delete this.review.urlId;
					}

					console.log('up')
					this.setReview(this.review);
					console.log('n');

					this.identified = true;
					console.log('tired');

					if(this.review.reviewed.urlId)
						this.$router.push({path:'/activity/'+this.review.activityUrlId+'/review/'+this.review.reviewed.urlId})
					else this.$router.push({path:'/activity/'+this.review.activityUrlId+'/review/'});
				//}



			},
			postReview(){
				this.setHasPushedSave(true);
				this.setReview(this.review);
				this.reviewId = this.review.urlId;
			},
			createReview(){
				
				if(this.reviewId == null){
					console.log('created')
					var review = {
								grader : new URL(window.location).searchParams.get("grader") || 'stupid grader',
								activityId : this.activity._id,
								activityUrlId : this.activity.urlId, 
								reviewed : '',
								skills : new Array(this.activity.rubrics.length)
							};
					
					if(review.grader == 'stupid grader') this.hasGraderParam = false;
					else this.hasGraderParam = true;

					for(var i=0;i<this.activity.rubrics.length;i++){
							review.skills[i]={
								rubricId: this.activity.rubrics[i]._id,
								name:this.activity.rubrics[i].name,
		            totalPossiblePoints: this.activity.rubrics[i].points,
		            skillDescriptors:new Array(this.activity.rubrics[i].descriptors.length)
							};
						

						for(var j=0;j<this.activity.rubrics[i].descriptors.length;j++){
							review.skills[i].skillDescriptors[j] = {
								descriptorId : this.activity.rubrics[i].descriptors[j]._id,
								possiblePoints : this.activity.rubrics[i].descriptors[j].points,
								acquired : false
							}
						}

						this.setReview(review);
					}
				}
			}
		},
	  beforeRouteEnter(to,from,next){

			if(to.params.reviewId){
				console.log('IM PASSING THERE')
				 next(async (vm)=>{
				 	
				 	await vm.resetReview();
				 	await vm.lookForActivity(to.params.id);

				 	let review = {
				 		activityUrlId : vm.activity.urlId,
				 		urlId : to.params.reviewId
				 	};

					await vm.lookForReview(review);

					vm.reviewId = to.params.reviewId;
				 });
			} else next(async vm=>{
					console.log('impassing')
					await vm.lookForActivity(to.params.id);
					var review = {
						activityUrlId : vm.activity.urlId,
					 	grader : {email : vm.emailParticipant}
					};

					await vm.lookForReviewFromParticipant(review);

					if(!vm.hasReview){
						await vm.resetReview();
						vm.createReview();
					}
			});
		},
		async beforeRouteUpdate(to,from,next){

			if(to.params.reviewId){
				console.log('IM PASSING THERE')
				 //next(async (vm)=>{
				 	
				 	await this.resetReview();
				 	await this.lookForActivity(to.params.id);

				 	let review = {
				 		activityUrlId : this.activity.urlId,
				 		urlId : to.params.reviewId
				 	};

					await this.lookForReview(review);

					this.reviewId = to.params.reviewId;
				 //});
			} else { 
				//next(async vm=>{
					console.log('impassing')
					await this.lookForActivity(to.params.id);
					var review = {
						activityUrlId : this.activity.urlId,
					 	grader : {email : this.emailParticipant}
					};

					
					await this.lookForReviewFromParticipant(review);
					
					if(!this.hasReview){
						await this.resetReview();
						this.createReview();
					}


				//});
			}
		}
	};
</script>

<style >
	
</style>