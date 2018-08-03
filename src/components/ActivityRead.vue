<template>
	<div id="action-bar">
		<div class ="action-activity level">
			<div class="level-item">
				<button class="button is-link" @click="manageActivity">Modify</button>
			</div>
			<div class="level-item">
				<button class="button is-link">Rubric</button>
			</div>
			<div class="level-item">
				<button class="button is-link">Re-send invitations</button>
			</div>
		</div>
		<pwd-activity v-if="manage"></pwd-activity>
		<div>
			<h1>Activity</h1>
		</div>
		
		<!-- <p>{{activity.title}}</p>
		<h1>Guidelines</h1>
		<p>{{activity.guidelines}}</p>
		<h1>Sessions</h1>
		<p>{{activity.sessions}}</p>
		<h1>Participants</h1>
		<p>
			<ul>
				<li v-for="participant in activity.participants">
					{{displayParticipant(participant)}}
				</li>
			</ul>
		</p> -->	
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
			noRedoNoFuckNo(){
				var container = document.getElementById('mainContainer'),
					actionBar = document.getElementById('action-bar'),
					containerPadding = parseInt(window.getComputedStyle(container, null).getPropertyValue('padding')),
					containerWidth = parseInt(window.getComputedStyle(container,null).getPropertyValue('width'));

				

				actionBar.style.position = 'relative';
				actionBar.style.width = `calc(100% + ${2*containerPadding}px)`
				actionBar.style.left = `${-containerPadding}px`;
				actionBar.style.top = `${-containerPadding}px`;
			},
			displayParticipant(participant){
				var a = ['name','group','role','token','reviewed','email','_id'],
						keys = Object.keys(participant).filter(c=>!a.includes(c)),
						info = [];

				for(var k of keys)
					info.push(participant[k]);

				return `${participant.group} ${participant.role} ${participant.name} ${info.join(' ')}`
			},
			manageActivity(){
				this.manage = true;
			}
		},
		mounted(){
			this.noRedoNoFuckNo();	
		},
		update(){
			this.noRedoNoFuckNo();
		}
	};
</script>

<style scoped>
	.action-activity{
		display: flex!important;
		background:#434e57;
		justify-content: center;
	}
</style>