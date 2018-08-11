<template>
	<div>

	<section id="create" class="section">
		<div class="has-text-centered">
			<h2 class="title">Students turn professors with PeersGrader, for free</h2>
			<p class="subtitle">The simple way to set up peers grading activities for your class.</p>
		</div>
		<br>
		<div class="box is-radiusless">
			<div class="field is-grouped">
				<p class="title-control control has-icons-left is-expanded">
					<input class="input" type="text" placeholder="What is your activity about ?" v-model="title">
					<span class="icon is-small is-left"><i class="fas fa-chalkboard"></i></span>
				</p>
				<p class="create-control control">
					<router-link id="create-button" :to="'/activity?title='+title" class="button is-info">
							Create activity
					</router-link >
				</p>
			</div>
	  </div>
	</section>

	<section id="how-to" class="section has-text-centered">
		<h3 class="title is-3">How it works</h3>
		<div class="columns">
		  <div class="column">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-setup.svg"></figure>
					<h4 class="title is-5">Suggest options</h4>
					<p>Select things like the activity name and guidelines, number of shifts within it, date, places.</p>
		  </div>
		  <div class="column">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-invite.svg"></figure>
					<h4 class="title is-5">Invite participants</h4>
					<p>With the invitation, they see their successive missions and grades the presenters. They don’t even need an account.</p>
		  </div>
		  <div class="column">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-grades.svg"></figure>
					<h4 class="title is-5">Visualize the results</h4>
					<p> Once the grades are in, visualize all grades! Both presenting skills and ability to fairly grade peers are taken into account.</p>
		  </div>
		</div>
	</section>

	<section id="dashboard" class="section has-text-centered">
		<div class="columns">
			<div class="column">
				<h3 class="title">Class dashboard</h3>
				<p>Once your class has played along, followed their missions and sent up the deserved grades, the Class dashboard show the results. Students works are evaluated by both the teachers, and their peers, each with respective weight as you set it up. Students ability to fairly grade peers is also taken into account. These 3 weighted grades are combined to provide the student's final grade.</p>
				<!-- We’re all about simplicity! Manage your activities from one organized place. View all your activities, ones you’ve created and participated in, from your dashboard. -->
			</div>
			<div class="column">
				<figure class="image is-4by3"><img class="img-landing-howto" src="../../static/images/howto-dashboard.svg"></figure>
			</div>
		</div>
	</section>

	<footer class="footer" id="authors">
		<div class="content has-text-centered">
				<p><strong>PeersGrader</strong> by <a href="https://github.com/mystermiam">Stéphane Jabol</a> et <a href="https://github.com/hugolpz">Hugo Lopez</a>, <a href="https://cri-paris.org">CRI Paris</a> <span class="icon is-small fa-1x"><img src="../../static/images/CRI-logo-sq-textless.svg" alt="Logo CRI-paris.org"></span>.
				<br><a href="https://opensource.org/licenses/mit-license.php">MIT License</a> & <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC-by-sa-4.0</a> for public <a href="https://en.wikipedia.org/wiki/Open_source">#OpenSource</a> & <a href="https://en.wikipedia.org/wiki/Open_data">#OpenData</a>!
				<span class="fa-stack fa-1x">
					<i class="fas fa-heart fa-stack-1x" style="color:#B10000;"  data-fa-transform="shrink-4 up-3"></i>
					<i class="fas fa-hand-holding fa-stack-1x" style="color:MistyRose"></i>
				</span>
				<br>Cutest illustrations designed by <a href="https://flaticon.com/packs/young-avatar-collection" title="Young Avatar Collection">Freepik</a> from Flaticon (<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>).
				<br>Made with <span class="icon has-text-danger"><i class="fas fa-heart"></i></span> in Paris.</p>
		</div>
	</footer>
	</div>
</template>

<script>
	export default {
		name : 'Landing',
		data(){
			return {
				title : ''
			};
		}
	}
</script>
<style scoped>
</style>
<!--
#howto .column,
#dashboard .column {
	margin: 0 1em 0 1em;
}

/*fuck this shit*/
input:focus + .icon {
	color:#1496ed;
}

.title-create-container{
	width: 100%;
	min-width: 100%;
}
.title-create{
	display: flex;
	flex-wrap: wrap;
}
#create-button{
	width: 100%;
}

@media screen and (max-width: 420px) {
	.title-create>*{
			margin: 0.5em 0 !important;
			flex-grow: 1;
	}
}

.title-create:last-child{
	flex-grow: 1;
}
 -->
