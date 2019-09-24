<template>
	<div>
		<button @click="getPlanningFinal()">get planning</button>
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
					<td v-for="(toReview,index) of participant.reviewed">{{toReview ? toReview.group : 'u'}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
	import {mapState,mapActions} from 'vuex'
	export default {
		name:'activityPlanning',
		computed : {
			...mapState('activity',{
				activity : 'activity',
				shifts : 'shifts'
			})
		},
		methods:{
			...mapActions('activity',{
      	lookForActivity:'lookForActivity',
      	getPlanningV2 : 'getPlanningV2',
      	getPlanningFinal: 'getPlanningFinal'
//      	getPlanningEmma : 'getPlanningEmma'
    	})
		},
		beforeRouteEnter(to,from,next){
			next((vm)=>{
					vm.lookForActivity(to.params.id)
				 });

			//http://localhost:5000/#/activity/t_z~k/planning
		}
	};
</script>

<style scoped>
	
</style>