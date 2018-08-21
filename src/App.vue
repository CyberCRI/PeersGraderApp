<template>
  <div id="pg-app">
    <notifications group="notifications"/>
    <div v-if="$route.path=='/'">
      <pg-header />
      <pg-landing/>
    </div>
    <div v-else id="pg-main-container" class="">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import Header from '@/components/Header'
  import Landing from '@/components/Landing'
export default {
  name: 'App',
  components : {
    'pg-header' : Header,
    'pg-landing' : Landing
  },
  data(){
    return {
      landing : true
    };
  },
  beforeRouteEnter(to,from,next){
    console.log('beforeRouteEnter')
    console.log('to',to)
    console.log('from',from)
  },
  beforeRouteUpdate(to,from,next){
    console.log('beforeRouteUpdate')
    console.log('to',to)
    console.log('from',from)
  },
  mounted(){
    var burger = document.querySelector('.burger');
    if(burger!=null){
      var menu = document.querySelector('#'+burger.dataset.target);
          burger.addEventListener('click', function() {
            burger.classList.toggle('is-active');
            menu.classList.toggle('is-active');
        });
    }
  }
}
</script>

<style>
  @import '../node_modules/bulma/css/bulma.css';

  html,body{
    height: 100%
  }


  #pg-app{
   display: flex;
   justify-content: center;
   align-items: center;
   width: 100%;
   height: 100%;
  }

  #pg-main-container{
   position : absolute;
   top:7.5%;
   left:12.5%;
   width: 75%;
  }


</style>
