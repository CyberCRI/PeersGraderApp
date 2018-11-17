<template>
		<div v-if="isAdmin || !withId">
			<!-- <a @click="postActivity" class="button level-item" >
				<span>Save</span>
			</a> -->
			<div class="level max-overall-score">
				<div class="field">
				  <label class="label">Maximum overall score</label>
				  <div class="control">
				    <input class="input" type="number" min="1" v-model="activity.basis" placeholder="Activity's basis">
				  </div>
				</div>
			</div>
			<div class="panel skill" v-for="(rubric,i) of activity.rubrics" :key="i">
					<div class="panel-heading skill-header">
							<div class="columns">
								<div class="column is-7 is-vcentered">
									<div class="field">
									  <div class="control">
									    <input v-model="rubric.name" class="input" type="text" placeholder="Skill's name">
									  </div>
									</div>
								</div>
								<div class="column is-4">
									<div class="field">
										<!-- <div class="control">
									    <a class="button is-info">
									      Total points
									    </a>
									  </div> -->
									  <div class="control">
									    <input v-model="rubric.points" class="input" type="number" min="1" placeholder="Skill's points">
									  </div>
									</div>
								</div>
								<div class="column is-1">
									<div class="add-skill has-text-centered" v-on:click="addSkill(i)">
										<i class="far fa-plus-square"></i>
									</div>
									<div class="remove-skill has-text-centered" @click="removeSkill(i)">
										<i class="far fa-minus-square"></i>
									</div>
								</div>
							</div>
					</div>
					<div class="panel-block hero is-light skill-subs">
					  
					    <div v-for="(descriptor,j) in rubric.descriptors" :key="j" >
					    	
					    	<div class="columns is-multiline descriptor is-vcentered">
					    		<div class="column is-7">
					    			<textarea class="textarea" v-model="descriptor.content" placeholder="Sub-skill to mastered, defined via a clean description"></textarea>
					    		</div>
						    	<div class="column is-4">
						    		
								    	<div class="select is-fullwidth">
									    	<select v-on:change="changeLevel(i,j) "v-model="descriptor.level">
												  <option disabled value="">Difficulty to master it</option>
												  <option :value="1">Easy</option>
												  <option :value="2">Medium</option>
												  <option :value="3">Hard</option>
												  <option :value="4">Expert</option>
												</select>
										
											</div>
								    	<p class="help"><br> 	</p>
						    	<!-- </div>
						    	<div class="column is-2"> -->
						    		
										  
										    <input v-model="descriptor.points" class="input is-extended" type="number" min="1" placeholder="descriptor's points">
												<p class="help">points for it.</p>
						    	</div>
						    	<div class="column is-1">
						    		<div class="add-descriptor has-text-centered" v-on:click="addDescriptor(i,j)">
											<i class="far fa-plus-square"></i>
										</div>
										<div class="remove-descriptor has-text-centered" @click="removeDescriptor(i,j)">
											<i class="far fa-minus-square"></i>
										</div>
						    	</div>
							  </div>
					    </div>
					  
					</div>
				
			</div>
		</div>
		<pwd-activity v-else/>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	import ActivityPassword from '@/components/ActivityPassword'
	export default{
		name:'ActivityRubric',
		data(){
			return{
			};
		},
		methods : {
			...mapActions('activity',{
				setActivity:'setActivity'
			}),
			changeLevel(i,j){
				this.activity.rubrics[i].descriptors.sort((a,b)=>a.level - b.level);
			},
			postActivity(){
				console.log('launch save rubric');
				/*if(this.check())
					this.setActivity(this.activity);
				else
					this.$notify({
						group:'notifications',
						type:'error',
						title:'Points skill incoherence'
					});*/
			},
			addSkill(i){
				this.activity.rubrics.splice(i+1,0,{
					name:'',
					points:0,
					descriptors:[{
						content:'',
						points:0,
						level:''
					}]
				});
			},
			removeSkill(i){
				if(this.activity.rubrics.length>1)
					this.activity.rubrics.splice(i,1);
			},
			addDescriptor(i,j){
				this.activity.rubrics[i].descriptors.splice(j+1,0,{
					content:'',
					points:0,
					level:''
				});
			},
			removeDescriptor(i,j){
				if(this.activity.rubrics[i].descriptors.length>1)
					this.activity.rubrics[i].descriptors.splice(j,1);
			}
		},
		components : {
			'pwd-activity' : ActivityPassword
		},
		computed : {
			...mapState('activity',{
				activity:'activity',
 				isAdmin  : 'isAdmin',
 				withId : 'withId'
			})
		}
	};
</script>

<style scoped>
	{
		align-self: center;
	}

	.descriptor{
		margin-top: 1em;
	}

	.panel{
		margin-top: 2em;
	}
</style>
