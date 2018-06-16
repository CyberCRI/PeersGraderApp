<template>
	<div>
		<p>{{activity.title}}</p>
		<p>{{activity.guidelines}}</p>
		<p>{{activity.sessions}}</p>
		<p>{{activity.presentations}}</p>
		<p>
			<ul>
				<li v-for="participant in activity.participants">
					{{participant.role}} {{participant.firstname}} {{participant.name}} : {{participant.email}}
				</li>
			</ul>
		</p>
	</div>
</template>

<script>
	import {mapState} from 'vuex'

	export default {
		computed:{
			...mapState('activity',{
				activity:'activity'
			})
		}
	};
</script>

<style>
	
</style>