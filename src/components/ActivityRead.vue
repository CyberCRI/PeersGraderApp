<template>
	<div>
		<h1>Activity</h1>
		<p>{{activity.title}}</p>
		<h1>Guidelines</h1>
		<p>{{activity.guidelines}}</p>
		<h1>Sessions</h1>
		<p>{{activity.sessions}}</p>
		<h1>Participants</h1>
		<p>
			<ul>
				<li v-for="participant in activity.participants">
					{{participant.role}} {{participant.firstname}} {{participant.name}} : {{participant.email}}
				</li>
			</ul>
		</p>
		<button v-if="!manage" @click="manageActivity"> Manage activity</button>
		<pwd-activity v-else></pwd-activity>
	</div>
</template>

<script>
	import {mapState} from 'vuex'
	import ActivityPassword from '@/components/ActivityPassword'

	export default {
		name : 'ActivityRead',
		data(){
			return {
				manage : false
			};
		},	
		components:{
			'pwd-activity' : ActivityPassword
		},
		computed:{
			...mapState('activity',{
				activity:'activity'
			})
		},
		methods : {
			manageActivity(){
				this.manage = true;
			}
		}
	};
</script>

<style>
	
</style>