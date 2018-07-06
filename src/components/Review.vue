<template>
	<div>
		<div v-if="displayRedirection">
			<p>No rubric for this actvity. Cannot review</p>
		</div>
		<div v-else >
			<a @click="postReview" class="button level-item" >
					<span>Save</span>
			</a>
			<div class="columns">
				<div class="column">
					<h1>Guidelines</h1>
					<p>{{activity.guidelines}}</p>
				</div>
			</div>
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
												  <input type="checkbox" >
												 	lol
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
</template>

<script>
	import {mapState,mapActions} from 'vuex';

	export default{
		name:'Review',
		data(){
			return {
				hasGraderParam : false
			};
		},
		computed:{
			...mapState('activity',{
				activity: 'activity'
			}),
			...mapState('review',{
				review:'review',
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
				lookForActivity: 'lookForActivity'
			}),
			...mapActions('review',{
				setReview : 'setReview',
				resetReview : 'resetReview',
				setHasPushedSave : 'setHasPushedSave'

			}),
			postReview(){
				this.setHasPushedSave(true);
				this.setReview(this.review);
			}
		},
		created(){
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
            descriptors:new Array(this.activity.rubrics[i].descriptors.length)
					};
				

				for(var j=0;j<this.activity.rubrics[i].descriptors.length;j++){
					review.skills[i].descriptors[j] = {
						descriptorId : this.activity.rubrics[i].descriptors[j]._id,
						possiblePoints : this.activity.rubrics[i].descriptors[j].points,
						acquired : false
					}
				}
			}

			this.setReview(review);
		},
		beforeRouteEnter(to,from,next){
			console.log('beforeRouteEnter')
			console.log('to review from x')
			console.log(to);
			console.log(from)
			

			if(to.params.rewiewId){
				 next((vm)=>{
				 	console.log('here whats up bitch')
				 	vm.lookForActivity(to.params.id)
					vm.lookForReview(to.params.reviewId);
				 });
			} else next(vm=>{
				vm.lookForActivity(to.params.id)
				vm.resetReview();
			});
		}
	};
</script>

<style >
	
</style>