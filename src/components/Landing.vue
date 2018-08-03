<template>
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
					<div class="columns">
						<p></p>
					</div>
	      </div>
	    </div>
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

<style>
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