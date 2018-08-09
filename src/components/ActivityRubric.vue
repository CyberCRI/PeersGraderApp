<template>
	<div>
		<div v-if="isAdmin">
			<a @click="postActivity" class="button level-item" >
				<span>Save</span>
			</a>
			<div class="level">
				<div class="field">
				  <label class="label">Basis</label>
				  <div class="control">
				    <input class="input" type="number" min="1" v-model="activity.basis" placeholder="Activity's basis">
				  </div>
				</div>
			</div>
			<div v-for="(rubric,i) of activity.rubrics" :key="i">
				<div class="columns">
					<div class="column">
						<div class="field has-addons">
							<div class="control">
						    <a class="button is-info">
						      Skill
						    </a>
						  </div>
						  <div class="control">
						    <input v-model="rubric.name" class="input" type="text" placeholder="Skill's name">
						  </div>
						</div>
					</div>
					<div class="column">
						<div class="field has-addons">
							<div class="control">
						    <a class="button is-info">
						      Total points
						    </a>
						  </div>
						  <div class="control">
						    <input v-model="rubric.points" class="input" type="number" min="1" placeholder="Skill's points">
						  </div>
						</div>
					</div>
					<div class="column">
						<div class="add-skill" v-on:click="addSkill(i)">
							<i class="far fa-plus-square"></i>
						</div>
						<div class="remove-skill" @click="removeSkill(i)">
							<i class="far fa-minus-square"></i>
						</div>
					</div>
				</div>
				<section class="hero is-light">
				  <div class="hero-body">
				    <div v-for="(descriptor,j) in rubric.descriptors" :key="j" class="columns">
				    	<div class="column">
				    		<textarea class="textarea" v-model="descriptor.content" placeholder="Descriptor's description"></textarea>
				    	</div>
				    	<div class="column">
				    		<div class="field">
						    	<div class="select">
							    	<select v-on:change="changeLevel(i,j) "v-model="descriptor.level">
										  <option disabled value="">Level</option>
										  <option :value="1">Easy</option>
										  <option :value="2">Medium</option>
										  <option :value="3">Hard</option>
										  <option :value="4">Expert</option>
										</select>
									</div>
						    </div>
				    	</div>
				    	<div class="column">
				    		<div class="field has-addons">
									<div class="control">
								    <a class="button is-info">
								      Points
								    </a>
								  </div>
								  <div class="control">
								    <input v-model="descriptor.points" class="input" type="number" min="1" placeholder="descriptor's point">
								  </div>
								</div>
				    	</div>
				    	<div class="column">
				    		<div class="add-descriptor" v-on:click="addDescriptor(i,j)">
									<i class="far fa-plus-square"></i>
								</div>
								<div class="remove-descriptor" @click="removeDescriptor(i,j)">
									<i class="far fa-minus-square"></i>
								</div>
				    	</div>
				    </div>
				  </div>
				</section>
			</div>
		</div>
		<pwd-activity v-else/>
	</div>
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
				setActivity:'setActivity',
			}),
			check(){
				return this.activity.rubrics.every(r=>Number(r.points) === r.descriptors.reduce((a,d)=>a+Number(d.points),0));
			},
			changeLevel(i,j){
				this.activity.rubrics[i].descriptors.sort((a,b)=>a.level - b.level);
			},
			postActivity(){
				console.log('launch save rubric');
				if(this.check())
					this.setActivity(this.activity);
				else
					this.$notify({
						group:'notifications',
						type:'error',
						title:'Points skill incoherence'
					});
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
 				isAdmin  : 'isAdmin'
			})
		}
	};
</script>

<style>
</style>
