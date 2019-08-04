<template>
	<div>
		<a v-if="participantRoute" @click="postActivity" class="button level-item" >
				<span>Update</span>
		</a>
		<div class="level participants-label">
			<label class="label">CSV Insertion</label>
		</div>
		<div class="field participants-label">
			<textarea @blur="convertCSV" id="textarea" v-model="csvInsertion" class="textarea" placeholder="Textarea"></textarea>
		</div>
		<div v-if="isCSVError()">
			<p style="color:red;">The field does not contain the minimum required field (email,group,role).</p>
		</div>
		<div class="level participants-label">
			<label class="label">Participants</label>
		</div>
		<div v-for="(participant,i) in activity.participants" class="row-participant">
			<div class="tooltip" :class="{'error-flag': isRowError(i), 'no-error' : !isRowError(i)}" >
				&nbsp;
				<div class="tooltip-text">{{getRowError(i) || 'Line is ok'}}</div>
			</div>
			<div v-for="key in customKeys(participant)" class="">
		       <input class="input" type="text" v-model="participant[key]" :placeholder="key">
			</div>
			<div class="">
		    <div class="">
		       <input class="input" type="email" v-model="participant.email" placeholder="email" style="text-transform:lowercase">
		    </div>
			</div>

			<div class="">
		    <div class="">
		       <input class="input" type="text" v-model="participant.group" placeholder="group">
		    </div>
			</div>

			<div class="">
		    <div class="">
		    	<div class="select">
			    	<select v-model="participant.role">
						  <option disabled value="">role</option>
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
				csvInsertion : '',
				participantRoute: false,
				check : false
			};
		},
		computed : {
			...mapState('activity',{
				activity : 'activity'
			}),
			...mapState('participants',{
				errors : 'errors'
			})
		},
		methods: {
			customKeys : function(participant){

				return Object.keys(participant).filter(x=>this.isNotDynamicKey(x));
			},
			isNotDynamicKey(key){
				return key!='token' && key!= 'email' && key!= '_id' && key!='group' && key!='role' && key!='reviewed'
			},
			isRowError(i){
				return this.errors.find(e=>e.line-1 == i || e.lineDuplicate-1 == i);
			},
			isCSVError(){
				return this.errors.find(e=>e.line == 0);
			},
			getRowError(i){
				var error = this.errors[this.errors.findIndex(e=>e.line-1 == i || e.lineDuplicate-1 == i)];

				if(error) return error.message;
				else return '';
			},
			isThereDuplicate(){
				this.setErrors([]);

				var emailsEntered = this.activity.participants.map(e=>e.email);

					for(var k=0,lineDuplicate=-1;k<emailsEntered.length;k++){
						lineDuplicate = emailsEntered.indexOf(emailsEntered[k],k+1);

						if(lineDuplicate > - 1){
							this.errors.push({
								line:k+1,
								lineDuplicate : lineDuplicate+1,
								message : `Duplicate email line ${k} on line ${lineDuplicate}.`,
								type: 'error'
							});
						}
					}
			},
			convertCSV(){
				var commaMode = true;
				this.setErrors([]);

				if(document.getElementById('textarea').value=='')return;

				var lines = document.getElementById("textarea").value.split("\n"),
						participantKeys = [],
						dataCSV = [];

				//reset errors tabs

      	for(var i=0,dataSize=0,dataFormat=[],splitChar='';i<lines.length;i++){
      		if(i==0){
      			if(lines[i].indexOf('\t') >-1 && lines[i].indexOf(',') == -1)
      				commaMode = false

      			splitChar = commaMode ? ',' : '\t';
      			dataFormat = lines[i].split(splitChar).map(e=>e.trim());
      			participantKeys = dataFormat.filter(e=>e!="_id"),
      			dataSize = dataFormat.length;




      			for(var j=0;j<dataFormat.length;j++){
      				let dataFormatDuplicate = dataFormat.indexOf(dataFormat[j],j+1);
      				if(dataFormatDuplicate>1){
      					this.errors.push({
      						type: 'warning',
      						message: 'Header contains duplicate field. Last value will count.'
      					})
      				}
      			}

      			if(!dataFormat.find(e=>e=='email') || !dataFormat.find(e=>e=='group') || !dataFormat.find(e=>e=='role')){
      				this.errors.push({
      					line: i
      				});
      			}

      		} else{
      			if(lines[i].trim().split(splitChar).length == dataSize){
      				dataCSV.push(lines[i].split(splitChar));
      			} else{
      				this.errors.push({
      					type : 'error',
      					message : 'The line ' + i +' is not matching the format set in header.',
      					line : i
      				});
      			}
      		}
      	}
      	//dataCSV.map(e=>)
      	if(this.errors.length == 0){
      		for(var i=0;i<dataCSV.length;i++){

      			var people = dataCSV[i];

      			if(this.activity.participants.length-1 < i) this.addParticipant(i)

      			for(var j=0; j<people.length;j++){

      				if(participantKeys[j]=='role'){
      					var value = people[j];
      					people[j] = value.charAt(0).toUpperCase() + value.slice(1);
      				}

      				this.activity.participants[i][participantKeys[j]] = people[j];
      			}
      		}

					this.isThereDuplicate();
 					this.check = true;
      	}
			},
			...mapActions('participants',{
				getParticipants:'getParticipants',
				setParticipants:'setParticipants',
				setActivityId:'setActivityId',
				setActivityUrlId : 'setActivityUrlId'
			}),
			...mapActions('activity',{
				setActivity:'setActivity',
			}),
			...mapActions('participants',{
				setErrors : 'setErrors'
			}),
			postActivity(){
				console.log('launch save');
				if(this.errors.length == 0)
					this.setActivity(this.activity);
			},
			addParticipant(i){
				this.activity.participants.splice(i+1,0,{
					name:'',
					group:'',
					email:'',
					role:'',
					reviewed:[]
				});

				this.isThereDuplicate();
				//this.setActivity(this.activity);
			},
			removeParticipant(i){
				if(this.activity.participants.length>1)
					this.activity.participants.splice(i,1);

				this.isThereDuplicate();
				//this.setActivity(this.activity)
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
	.tooltip {
	    position: relative;
	    display: inline-block;
	}

	.tooltip .tooltip-text {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;

    /* Position the tooltip */
    position: absolute;
    z-index: 1;
	}

	.tooltip:hover .tooltip-text {
	    visibility: visible;
	}

	.error-flag{
		content:"";
		border-left:solid 3px red;
		height: 100%;
		cursor:pointer;
	}

	.no-error{
		content:"";
		border-left:solid 3px #00d1b2;
		height: 100%;
		cursor:pointer;
	}

	input,select,textarea{
		border-radius: 0px!important;
	}
	.row-error{
		border-bottom: solid red 1px;
	}
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



	h2{
		text-align: center;
		margin: 1.2em auto;
		width: 20%;
		font-size: 2vh;
	}

	.add-participant{
		cursor: pointer;
		margin:0 0.3em;
	}

	.remove-participant{
		cursor: pointer;
		margin: 0 0.3em;
	}
</style>
