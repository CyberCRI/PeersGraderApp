<template>
	<div>
		<div v-show="showStep === 1 " class="content-pg">
			<h2>Create activity 1/2</h2>
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<label class="label">Title</label>
				</div>
				<div class="field-body">
			    <div class="field">
			       <input v-model="title" class="input" type="text" placeholder="Activity's title">
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
			        <textarea class="textarea" v-model="guidelines" placeholder="Activity's guidelines"></textarea>
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
			       <input class="input" type="number" v-model="sessions" placeholder="How many sessions will there be ?">
			    </div>		
				</div>
			</div>
			<div class="field is-horizontal">
				<div class="field-label is-normal">
					<label class="label">Presentations</label>
				</div>
				<div class="field-body">
			    <div class="field">
			       <input class="input" type="number" v-model="presentations" placeholder="How many presentations per sessions will there be ?">
			    </div>		
				</div>
			</div>
		</div>
		<div v-show="showStep === 2 " class="content-pg">
			<h2>Create activity 2/2</h2>
			<div class="field">
				<label class="label">Participants</label>
			</div>
			<div v-for="(participant,i) in participants" class="field is-horizontal">
				<div class="field-body">
			    <div class="field">
			       <input class="input" type="text" v-model="participant.firstname" placeholder="Participant's firstname">
			    </div>		
				</div>
				<div class="field-body">
			    <div class="field">
			       <input class="input" type="text" v-model="participant.name" placeholder="Participant's name">
			    </div>		
				</div>
				<div class="field-body">
			    <div class="field">
			       <input class="input" type="email" v-model="participant.email" placeholder="Participant's email">
			    </div>		
				</div>
				<div class="field-body">
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
				<div class="field-body">
					<i class="far fa-plus-square"></i>
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
							Submit
						</a>
						<a
				</p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name : 'Activity',
		data(){
			return {
				presentations:0,
				sessions : 0,
				title : '',
				participants:[{
					firstname : '',
					name : '',
					email : '',
					role : ''
				}],
				guidelines : '',
				showStep : 1
			};
		},
		computed : {
			checkFirstStepCompletion(){
				return this.title && this.guidelines && this.sessions && this.presentations;
			}
		},
		methods: {
			postActivity(){

			},
			goStep1(e){
				e.preventDefault();
				this.showStep = 1;
			},
			goStep2(e){
				e.preventDefault();

				if(!this.checkFirstStepCompletion) return;

				else this.showStep = 2;
			}
		}
	}
</script>

<style scoped>
	/*#stepper{
		position:fixed;
		top:85%;
	}*/

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


</style>