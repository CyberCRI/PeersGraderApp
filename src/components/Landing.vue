<template>
	<div class="landing-content">

	<section id="create" class="section bg-school">
		<div class="container">
			<div class="is-italic has-text-centered">
				<h2 class="title has-text-white">Students turn professors with PeersGrader, for free</h2>
				<p class="subtitle is-4 has-text-white">The simple way to set up peers grading activities for your class.</p>
			</div>
			<br>
			<div class="box bg-wood" ><!--  is-radiusless -->
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
		</div>
	</section>

	<section id="how-to" class="section bg-wood has-background-light has-text-centered">
    <div class="container">
		<h3 class="title is-3">How it works</h3>
		<div class="columns is-multiline">
		  <div class="column is-6">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-setup.svg"></figure>
					<h4 class="title is-5">1. Suggest options</h4>
					<p>Sets things like the activity name and general guidelines, number of shifts within it, date, places, a detailed rubric.</p>
		  </div>
		  <div class="column is-6">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-invite.svg"></figure>
					<h4 class="title is-5">2. Invite participants</h4>
					<p>Invitations are sent via emails, each student receive a detailed rubric & personal schedule with professor & presenter turns. They don’t even need an account.</p>
		  </div>
			<div class="column is-6">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-activity.svg"></figure>
					<h4 class="title is-5">3. D-Day</h4>
					<p>Both works-presentations and ability to fairly grade peers are recorded. Communication, comments, peers-learning plays at fullest. Participants send grades via mobiles before leaving.</p>
		  </div>
		  <div class="column is-6">
					<figure class="image is-2by1"><img class="img-landing-howto" src="../../static/images/howto-grades.svg"></figure>
					<h4 class="title is-5">4. Visualize the results</h4>
					<p>Hurray ! Open the secret teacher's dashboard to visualize all grades : hundreds or thousands of calculations are done, ready to be collected. <span class="icon has-text-danger"><i class="fas fa-heart"></i></span></p>
		  </div>
		</div>
	</div>
	</section>

	<section id="dashboard" class="section bg-school has-text-centered">
		<div class="container">
			<div class="columns">
				<div class="column">
					<h3 class="title has-text-white is-desktop is-vcentered">Class dashboard</h3>
					<p>Once your class has played along, followed their missions and sent up the deserved grades, the Class dashboard show the results. Students works are evaluated by both the teachers, and their peers, each with respective weight as you set it up. Students ability to fairly grade peers is also taken into account. These 3 weighted grades are combined to provide the student's final grade.</p>
					<!-- We’re all about simplicity! Manage your activities from one organized place. View all your activities, ones you’ve created and participated in, from your dashboard. -->
				</div>
				<div class="column">
					<figure class="image is-4by3"><img class="img-landing-howto" src="../../static/images/howto-dashboard.svg"></figure>
				</div>
			</div>
		</div>
	</section>

	<section id="rubric" class="section has-background-warning has-text-centered">
	<div class="container">
			<div class="columns">
				<div class="column">
					<figure class="image is-4by3"><img class="img-landing-howto" src="../../static/images/howto-rubric.svg"></figure>
				</div>
				<div class="column">
					<h3 class="title">Detailed rubric</h3>
					<p>Grading rubrics helps students to better assess their peers works. Rubrics helps the students to integrate how grading occurs, which aspects matter, where to focus their attention. PeersGrader include a clean rubric editor. With the relevant admin password, the teacher can edit the detailed rubric with the rubric's title, description, maximum score. Then set the core skills and their various subskills, asssociated with their relevant gains when mastered. This details are then consolidate into a review form. When observing a work or presentation, student in teacher role can <i>tick</i> the relevant subskills, thus methodologically giving a grade to their peers. The results mus then be sent to the PeerGrader for processing.</p>
				</div>
			</div>
		</div>
	</section>
	<section id="authors" class="section has-background-grey-dark has-text-centered">
	<!--
		<div class="container has-text-white">
			<p>PeersGrader by <a href="https://github.com/mystermiam">Stéphane Jabol</a> et <a href="https://github.com/hugolpz">Hugo Lopez</a>, <a href="https://cri-paris.org">CRI Paris</a> <span class="icon is-small fa-1x"><img src="../../static/images/logo-cri-sq-textless.svg" alt="Logo CRI-paris.org"></span>.
			<br><a href="https://opensource.org/licenses/mit-license.php">MIT License</a> & <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/">CC-by-sa-4.0</a> for public <a href="https://en.wikipedia.org/wiki/Open_source">#OpenSource</a> & <a href="https://en.wikipedia.org/wiki/Open_data">#OpenData</a>!
			<span class="fa-stack fa-1x">
				<i class="fas fa-heart fa-stack-1x" style="color:#B10000;"  data-fa-transform="shrink-4 up-3"></i>
				<i class="fas fa-hand-holding fa-stack-1x" style="color:MistyRose"></i>
			</span>
			<br>Cutest illustrations designed by <a href="https://flaticon.com/packs/young-avatar-collection" title="Young Avatar Collection">Freepik</a> from Flaticon (<a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a>).</p>
		</div> -->

		<div class="container">
		  <div class="columns has-text-left has-text-white">
			<div class="column">
				<h4 class="title is-5 has-text-white has-text-weight-normal"><span class="has-text-weight-bold">PeersGrader</span> by <span class="has-text-link">Taly</span>, <a href="https://github.com/mystermiam">Jabol</a> & <a href="https://github.com/hugolpz">Lopez</a></h4>
				<div class="subtitle is-6 has-text-white">Kindly supported by
				<a href="https://cri-paris.org">CRI Paris <span class="icon fa-1x" style="vertical-align: middle;"><img src="../../static/images/logo-cri-sq-textless.svg" alt="Logo CRI-paris.org"></span></a> -
				<a href="http://univ-paris5.fr">Paris 5 <span class="icon fa-1x" style="vertical-align: middle;"><img src="../../static/images/logo-paris5-sq.svg" alt="Logo Paris5.fr"></span></a></div>
			</div>
			<div class="column is-4 mobile-hidden">
			  <h4 class="title is-5 has-text-white">Contribute <span class="has-text-weight-normal">on GitHub</span></h4>
				<div class="subtitle is-6 has-text-white">
					<iframe src="https://ghbtns.com/github-btn.html?user=mystermiam&repo=PeersGraderJS&type=star&count=true&size=large" frameborder="0" scrolling="0" width="114px" height="30px"></iframe>
					<iframe src="https://ghbtns.com/github-btn.html?user=hugolpz&type=follow&count=true&size=large" frameborder="0" scrolling="0" width="220px" height="30px"></iframe>
					<iframe src="https://ghbtns.com/github-btn.html?user=mystermiam&type=follow&count=true&size=large" frameborder="0" scrolling="0" width="212px" height="30px"></iframe>
					<iframe src="https://ghbtns.com/github-btn.html?user=mystermiam&repo=PeersGraderJS&type=fork&count=false&size=large" frameborder="0" scrolling="0" width="90px" height="30px"></iframe>
				</div>
			</div>
			<div class="column">
				<h4 class="title is-5 has-text-white">Open licenses
					<span class="icon fa-1x"> <img src="../../static/images/icon-heart-in-hand.svg" alt=""></span>
				</h4>
				<div class="subtitle is-6 has-text-white">
					Source codes under <a href="https://opensource.org/licenses/mit-license.php">MIT license</a>
					<br>Website content <a rel="license" href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC-by-nc-sa-4.0</a>.
					<br>Cutest illustrations by <a href="https://flaticon.com/packs/young-avatar-collection" title="Young Avatar Collection">Flaticon</a> <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC-BY-3.0</a>
				</div>
			</div>

		  </div>
		</div>

	</section>

	<footer class="section has-background-black has-text-centered has-text-white">
		<div class="container">
			<div class="columns">
				<div class="column">
					<p class="has-text-weight-bold is-size-7">Made with <span class="icon has-text-danger"><i class="fas fa-heart"></i></span> in Paris.</p>
				</div>
				<div class="column">
					<p><a href="./" class="has-text-white has-text-weight-bold">PeersGrader</a> — <span class="is-italic is-size-7">Let's do it!</span></p>
				</div>
				<div class="column  is-3">
					<a href="https://github.com/CyberCRI/PeersGraderApp" class="has-text-white has-text-weight-bold"><span class="icon"><i class="fab fa-github-alt"></i></span></a>
				</div>
			</div>
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
	.bg-wood {
		background-image: url("../../static/images/bg-wood.png"); }
	.bg-school{
		color: white!important;
		background-size: 200px 200px;
   	background-image:  linear-gradient(to bottom,
     rgba(55,152,212,0.93) 0%,
     rgba(55,152,212,0.93) 100%),
     url("../../static/images/bg-school.svg");
	}

	.landing-content{
		position: absolute;
		top: 54px;
		left: 0;
		right: 0;
	}
	input:focus + .icon {
		color:#1496ed;
	}
	.mobile-hidden {
  display: none;
}

@media (min-width: 769px) {
  .mobile-hidden {
    display: block;
  }
}
</style>
