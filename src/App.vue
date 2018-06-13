<template>
  <div id="app">
    <pg-header></pg-header>
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from '@/components/header'
export default {
  name: 'App',
  components : {
    'pg-header' : Header
  }
}
</script>

<style>
  @import '../node_modules/bulma/css/bulma.css';
  
  html,body{
    height: 100%
  }

  #app{
    position:relative;
    top:50%;
    transform: translateY(-50%);
    height: 50%;
    width:70%;
    margin:0 auto;
    overflow-y: scroll;
    border: solid black 1px;
  }

  .content-pg{
    position: absolute;
    transform: translateY(-50%);
    top:50%;
    width: 100%
  }
</style>
