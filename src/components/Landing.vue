<template>
	<div>
		<div class="column" style="text-align: center;">
			<h2 class="title" style="font-size:2.5em;">Spice up learning with PeersGrader, for free</h2>
			<p>The simple way to set up peers grading activities for your class.</p>
		</div>
		<div class="column">
			<div class="card">
		    <div class="card-content">
		      <div class="content">
		      	<div class="columns">
		      		<div id="title-create-container" class="column">
				          <div class="title-create field is-grouped">
									  <div class="title-control control has-icons-left is-expanded">
									    <input class="input" type="text" placeholder="What is it about ?" v-model="title">
									    <span class="icon is-small is-left">
								      	<i class="fas fa-chalkboard"></i>
								    	</span>
									  </div>
									  <div class="create-control control">
									  	<router-link id="create-button" :to="'/activity?title='+title" class="button is-info">
	                        Create activity
	                  	</router-link >
									  </div>
									</div>
							</div>
						</div>
		      </div>
		    </div>
		  </div>
		</div>
		<div class="column how-it-works">
			<article class="column">
				<h1 class="title" style="text-align: center;font-size:2.5em">How it works</h1>
				<div class="level pg-pg">
					<div class="pg-column">
					
								<p class="item"><img class="img-landing" src="../../static/images/howto-setup.svg"></p>
								<h3 class="item item-title">Suggest options</h3>
								<p class="item">Select things like the activity name and guidelines, number of shifts within it, date, places.</p>
							
					</div>
					<div class="pg-column">
					
								<p class="item"><img class="img-landing"  src="../../static/images/howto-invite.svg"></p>
								<h3 class="item item-title">Invite participants</h3>
								<p class="item">With the invitation, they see their successive missions and grades the presenters. They don’t even need an account.</p>
				
					</div>
					<div class="pg-column">
					
								<p class="item"><img class="img-landing"  src="../../static/images/howto-grades.svg"></p>
								<h3 class="item item-title">Visualize the results</h3>
								<p class="item"> Once the grades are in, visualize all grades! Both presenting skills and ability to fairely grade peers are taken into account.</p>
							
					</div>
				</div>
			</article>
		</div>
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
.pg-pg{
	flex: 1 0 280px;
}

.how-it-works{
	margin-top: 3em;
}

.item-title{
	font-size: 1.3em;
	font-weight: bold;
}

.item{
	margin: 0.5em 0 0.5em 0;
}

.pg-column{
	min-width: 110px;
	max-width: 280px;
	min-height: 240px;
	text-align: center;
	display: flex;
	flex-direction: column;
	margin: 1em 1em;
}

.img-landing {
	min-width: 100px;
	min-height: 20px;
	max-height: 170px;
	max-height: 60px;
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

	
</style>