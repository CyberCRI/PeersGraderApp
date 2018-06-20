<template>
	<div>
		<a v-if="participantRoute" @click="postActivity" class="button level-item" >
				<span>Update</span>
		</a>
		<div class="level participants-label">
			<label class="label">Participants</label>
		</div>
		<div class="level participants-label">
			<label class="label">CSV Insertion</label>
		</div>
		<div class="field participants-label">
			<textarea @blur="convertCSV" id="textarea" class="textarea" placeholder="Textarea"></textarea>
		</div>
		<div v-for="(participant,i) in activity.participants" class="row-participant">
			<div class="">
		    <div class="field">
		       <input class="input" type="email" v-model="participant.email" placeholder="Participant's email">
		    </div>		
			</div>
			<div class="">
		    <div class="field">
		       <input class="input" type="text" v-model="participant.name" placeholder="Participant's name">
		    </div>		
			</div>
			<div class="">
		    <div class="field">
		       <input class="input" type="text" v-model="participant.group" placeholder="Participant's group">
		    </div>		
			</div>
			<div class="">
		    <div class="field">
		       <input class="input" type="number" v-model="participant.cohort" placeholder="Participant's cohort">
		    </div>		
			</div>
			<div class="">
		    <div class="field">
		       <input class="input" type="text" v-model="participant.ine" placeholder="Participant's ine">
		    </div>		
			</div>
			<div class="">
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
			<div class="add-participant" v-on:click="addParticipant(i)">
				<i class="far fa-plus-square"></i>
			</div>
			<div class="remove-participant" @click="removeParticipant(i)">
				<i class="far fa-minus-square"></i>
			</div>
		</div>				
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		name : 'ActivityParticipants',
		data(){
			return {
				participantRoute: false
			};
		},
		computed : {
			...mapState('activity',{
				activity : 'activity'
			})
		},
		methods: {
			convertCSV(){
				var lines = document.getElementById("textarea").value.split("\n"),
						participantKeys = Object.keys(this.activity.participants[0]),
						dataCSV = [],
						errors = [];
      	
      	for(var i=0,dataSize=0;i<lines.length;i++){
      		if(i==0){
      			dataSize = lines[i].split(',').length;
      		} else{
      			if(lines[i].split(',').length == dataSize){
      				dataCSV.push(lines[i].split(','));
      			} else{
      				errors.push('The line ' + (i+1) +' is not matching the required data format.');
      			}
      		}
      	}

      	if(errors.length == 0){
      		for(var i=0;i<dataCSV.length;i++){
      			var people = dataCSV[i];
      			if(this.activity.participants.length-1 < i) this.addParticipant(i)
      			for(var j=0; j<people.length;j++){
      				console.log('key')
      				console.log(participantKeys[j])
      				console.log('people')
      				console.log(people[j])
      				if(participantKeys[j]=='role'){
      					var value = people[j];
      					people[j] = value.charAt(0).toUpperCase() + value.slice(1);
      				}

      				this.activity.participants[i][participantKeys[j]] = people[j];
      			}
      		}
      	}
			},
			...mapActions('participants',{
				getParticipants:'getParticipants',
				setParticipants:'setParticipants',
				setActivityId:'setActivityId',
				setActivityUrlId : 'setActivityUrlId'
			}),
			...mapActions('activity',{
				setActivity:'setActivity'
			}),
			postActivity(){
				console.log('launch save');
				this.setActivity(this.activity);
			},
			addParticipant(i){
				this.activity.participants.splice(i+1,0,{
					firstname:'',
					name:'',
					email:'',
					role:''
				});
			},
			removeParticipant(i){
				if(this.activity.participants.length>1)
					this.activity.participants.splice(i,1);
			}
		},
		beforeRouteEnter(to,from,next){
			next(vm=>{
				/*vm.setActivityId(vm.$store.state.activity.activity._id)
				vm.setActivityUrlId(vm.$store.state.activity.activity.urlId);
				vm.getParticipants(vm.$store.state.activity.activity.urlId);*/
				console.log('in there')
				vm.participantRoute = true;
			})
		}
	};
</script>

<style scoped>
	.participants-label{
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
	}
</style>