<template>
	<nav class="navbar" role="navigation" aria-label="main navigation">
	  <div class="navbar-brand">
	    <span class="navbar-item" href="https://bulma.io">
	      <img src="../../static/images/CRI.png" alt="Centre de recherches interdisciplinaires">
	      PeerGraders
	    </span>
	    <router-link to="/activity" class="navbar-item" >
         Create new activity
      </router-link >
      <router-link to="/find/activity" class="navbar-item" >
         Find an activity
      </router-link >

	    <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false">
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	      <span aria-hidden="true"></span>
	    </a>
	  </div>
	</nav>
</template>

<script>
	
</script>

<style scoped>
	nav {
		border:solid 1px black;
		height: 7%;
		margin-bottom: 1vh;
	}


</style>