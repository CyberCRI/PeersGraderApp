<template>
	<div>
		<button @click="getPlanningV2()">get planning</button>
		<table class="table">
			<thead>
				<tr><td colspan="2"></td><td :colspan="shifts.length" style="text-align:center;">Shifts</td></tr>
				<tr><td>groupe</td><td>étudiant</td>
					<td v-for="(shift,index) of shifts" :key="index+shifts[index]">#{{index+1}}</td></tr>
			</thead>
			<tbody>
				<tr v-for="participant in activity.participants">
					<td>{{participant.group}}</td>
					<td>{{participant.email}}</td>
					<td v-for="(toReview,index) of participant.reviewed">{{toReview ? toReview.group : 'uncomputed'}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		name:'activityPlanning',
		data(){
			return{
			};
		},
		computed : {
			...mapState('activity',{
				activity : 'activity',
				shifts : 'shifts'
			})
		},
		methods:{
			...mapActions('activity',{
      	lookForActivity:'lookForActivity',
      	getPlanningV2 : 'getPlanningV2'
    	})
			/*resetPlanning(){
				this.shifts = [];
				this.activity.participants.map(c=>{c.reviewed=[];return c});
			},
    	maxSizePool(groups){
    		var nameGroups = Object.keys(groups),
    				max=-1;
    		for(let group of nameGroups)max = groups[group].length > max ? groups[group].length : max;
    		
    		return max;
    	},
			getPlanning(){
				var vm = this,
						nbrStudents = 0,
						groups = getGroups(),
						nbStudents = nbrStudents,
						nameGroups = Object.keys(groups),
						nbGroups = nameGroups.length,
						shifts = [{
							pools: new Array(nbGroups).fill().map(x=>({presenter:'',graders:[]}))
						}],
						sizePool = this.maxSizePool(groups),
						presenters=[],
						indexShift = 0,
						indexPool = 0,
						countHack=0;
				
				//this.resetPlanning();

				this.activity.participants.map(c=>{c.reviewed=[];return c});

				function isIn(table,key,value){
					return table.find(e=>e[key]==value)
				}
				function getGroups(){
					return vm.activity.participants.reduce((a,c)=>{
						a[c.group] = a[c.group] || [];
						if(c.role=='Student'){
							a[c.group].push(c);
							nbrStudents++;
						}
						return a;
					},{});
				}
				function setFirstShift(){
					console.log('getGroups')
					console.log(groups)
					while(nameGroups.some(e=>groups[e].length > 0)){
						for(let group of nameGroups){
						
							let participant = groups[group].shift();
							distributeParticipantsFirstShift(participant)	
						}
					}
				}
				/*
				ajoute à un reviewer à un participant
				
				function addReviewed(indexShift,indexPool,participant){
					if(shifts[indexShift].pools[indexPool].presenter!=''){
						let indexParticipant = vm.activity.participants.findIndex(e=>e.email==participant.email)
			
						vm.activity.participants[indexParticipant].reviewed.push(shifts[indexShift].pools[indexPool].presenter);
					}
				}
				/*	
					ajoute à tous les graders présents dans la poule le groupe de review du présentateur, dans le cas où
					le participant est ajouté après les graders
				
				function addReviewers(indexShift,indexPool){
					if(shifts[indexShift].pools[indexPool].graders.length>0){
						for(let grader of shifts[indexShift].pools[indexPool].graders){
							let indexParticipant = vm.activity.participants.findIndex(e=>e.email==grader.email)
						
							vm.activity.participants[indexParticipant].reviewed.push(shifts[indexShift].pools[indexPool].presenter);
						}
					}
				}
				function distributeParticipantsFirstShift(participant){
					if(indexPool>=nbGroups)indexPool = 0;
					if(participant){
						do{//le participant est ajouté à la poule courante si ...
								if( shifts[indexShift].pools[indexPool].presenter == ''//pas de présentateur déjà existant  
											&& !isIn(presenters,'group',participant.group)){ // & pas un qui a déjà présenté
									shifts[indexShift].pools[indexPool].presenter = participant;
									presenters.push(participant)
									addReviewed(indexShift,indexPool,participant);
									addReviewers(indexShift,indexPool);
									indexPool++;
									participant = null;
								} else if (!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group)
										&& shifts[indexShift].pools[indexPool].presenter.group != participant.group 
										&& shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
									//si dans les graders de la poule il n'y pas déjà un étudiant du même groupe
									//si le présentateur a une groupe différent du participant à insérer dans les graders
									shifts[indexShift].pools[indexPool].graders = shifts[indexShift].pools[indexPool].graders 
																																	|| [];
									shifts[indexShift].pools[indexPool].graders.push(participant);
									addReviewed(indexShift,indexPool,participant);
									participant = null;
								} else {
									indexPool++;
									if(indexPool>=nbGroups)indexPool = 0;
										if( shifts[indexShift].pools[indexPool].presenter == '' 
													&& !isIn(presenters,'group',participant.group)){
											shifts[indexShift].pools[indexPool].presenter = participant;
											presenters.push(participant)
											addReviewed(indexShift,indexPool,participant);
											addReviewers(indexShift,indexPool)
											participant = null;
										}
										else if (!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group)
											&& shifts[indexShift].pools[indexPool].presenter.group != participant.group 
											&& shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
											shifts[indexShift].pools[indexPool].graders = shifts[indexShift].pools[indexPool].graders 
																																			|| [];
											shifts[indexShift].pools[indexPool].graders.push(participant);
											
											addReviewed(indexShift,indexPool,participant);
											participant = null;
										}
								}
							
							}while(participant!=null)
						}
				}
				function getGraders(indexShift){
					return shifts[indexShift].pools.reduce((a,c,i)=>{a=a||[];a.push(c.graders);return a;},[]);
				}
				function setOtherShift(groups){

					while(nameGroups.some(e=>groups[e].length > 0)){
						for(let group of nameGroups){
							
							let participant = groups[group].shift();
							
							distributeParticipantsShift(participant)	
						}
					}
					function distributeParticipantsShift(participant){
						let count = 0;
						if(participant){
							do{ 
									if(indexPool>=nbGroups)indexPool = 0;
									if(shifts[indexShift].pools[indexPool].presenter == '' 
										&& !isIn(presenters,'email',participant.email) 
										&& !isIn(shifts[indexShift].pools[indexPool].graders,'group',participant.group)
										&& !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.reduce((t,x)=>x.group!=c.group?t.concat(x.group):t,[])),[]).includes(participant.group)){
										//&& !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.filter(x=>x.group!=c.group).reduce((t,x)=>t.concat(x.group),[])),[]).includes(participant.group)){
										//si les graders on déjà évalué le participant on zappe
										shifts[indexShift].pools[indexPool].presenter = participant;
										presenters.push(participant);
										addReviewed(indexShift,indexPool,participant);
										addReviewers(indexShift,indexPool)
										indexPool++;
										participant = null;
									} else if(!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group) 
										&& shifts[indexShift].pools[indexPool].presenter.group != participant.group 
										 && !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.reduce((a,c)=>c.group!=x.group?a.concat(c.group):a,[]).includes(participant.reviewed[indexShift-1].group))
										 //&& !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.filter(c=>c!=x.group).includes(participant.reviewed[indexShift-1]))
										  && !participant.reviewed.filter(x=>x!=participant.group).includes(shifts[indexShift].pools[indexPool].presenter.group)
											&& shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
											
											//si dans les graders il n'y a pas déjà un étudiant avec qui le participant a évalué un groupe au tour précédent
											//si le participant n'a pas déjà évalué le même sujet 
											//si la poule n'est pas remplie
											
											shifts[indexShift].pools[indexPool].graders.push(participant);
											addReviewed(indexShift,indexPool,participant);
											participant = null;
									} else {
										indexPool++;
										if(indexPool>=nbGroups)indexPool = 0;
										if(shifts[indexShift].pools[indexPool].presenter == '' 
											&& !isIn(presenters,'email',participant.email) 
											&& !isIn(shifts[indexShift].pools[indexPool].graders,'group',participant.group)
											&& !shifts[indexShift].pools[indexPool].graders.reduce((a,c)=>a.concat(c.reviewed.reduce((t,x)=>x.group!=c.group?t.concat(x.group):t,[])),[]).includes(participant.group)){
											shifts[indexShift].pools[indexPool].presenter = participant;
											presenters.push(participant);
											addReviewed(indexShift,indexPool,participant);
											addReviewers(indexShift,indexPool)
											indexPool++;
											participant = null;
										} else if(!shifts[indexShift].pools[indexPool].graders.find(e=>e.group==participant.group) 
										&& shifts[indexShift].pools[indexPool].presenter.group != participant.group 
										&& !shifts[indexShift].pools[indexPool].graders.some(x=>x.reviewed.reduce((a,c)=>c.group!=x.group?a.concat(c.group):a,[]).includes(participant.reviewed[indexShift-1].group))
										  && !participant.reviewed.filter(x=>x!=participant.group).includes(shifts[indexShift].pools[indexPool].presenter.group)
											&& shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
											
										
											shifts[indexShift].pools[indexPool].graders.push(participant);
											addReviewed(indexShift,indexPool,participant);
											participant = null;
										}
									}
									//ugly hack, find math reason behind it. figure out in which condition you can/ cannot apply each constraint
									if(count>nbGroups){
										console.log("j'ai mal à mon code, enfin bcp plus mal, genre c'était possible ? ah ouais oaui WAI WE" );
										if(shifts[indexShift].pools[indexPool].presenter==''){
											shifts[indexShift].pools[indexPool].presenter = participant;
											presenters.push(participant);
											addReviewed(indexShift,indexPool,participant);
											addReviewers(indexShift,indexPool,participant);
											participant = null;
										} else {
											if(shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
													shifts[indexShift].pools[indexPool].graders.push(participant);
													addReviewed(indexShift,indexPool,participant);
													participant = null;
											}
										}
										/*if(countHack>nbGroups){
											console.log("j'ai mal à mon code, enfin bcp plus mal, genre c'était possible ? ah ouais oaui WAI WE" );
											if(shifts[indexShift].pools[indexPool].presenter=='' ){
												shifts[indexShift].pools[indexPool].presenter = participant;
												presenters.push(participant);
												addReviewed(indexShift,indexPool,participant);
												addReviewers(indexShift,indexPool,participant);
												participant = null;
											} else {
												if(shifts[indexShift].pools[indexPool].graders.length < sizePool-1){
													shifts[indexShift].pools[indexPool].graders.push(participant);
													addReviewed(indexShift,indexPool,participant);
													participant = null;
												}
											}
											countHack = 0;
										} else {
											groups[participant.group].push(participant);
											participant = null;
											countHack++;	
										}
										
									}				
									count++;
							}while(participant!=null)
						}
					}
				}
			
				setFirstShift();
				indexShift++;
				indexPool = 0;
				
				var sessions = 0;
				do{

					sessions++;

					while(presenters.length < nbStudents ){
						shifts.push({
								pools: new Array(nbGroups).fill().map(x=>({presenter:'',graders:[]}))
						});
						groups = getGroups();
						setOtherShift(groups)
						indexShift++;
						indexPool = 0;
					}
					presenters = [];
				}while(sessions < this.activity.sessions);
				
				this.shifts = shifts;
				console.log('shifts over')
				console.log(shifts)

			}*/
		},
		beforeRouteEnter(to,from,next){
			next((vm)=>{
					vm.lookForActivity(to.params.id)
				 });
		}
	};
</script>

<style scoped>
	
</style>