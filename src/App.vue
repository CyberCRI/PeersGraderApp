<template>
  <div id="pg-app"> <!-- main component for the app -->
    <notifications group="notifications"/>
    <div v-if="$route.path=='/'"> <!-- global $route object made available by adding router to the vue instance, if path is /, user is visiting first page, therefore we display header and landing components -->
      <pg-header /> <!-- header component, see src/components/Header.vue-->
      <pg-landing /><!-- landing componenet, see src/components/Landing.vue-->
    </div>
    <div v-else id="pg-main-container" class="">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
/* TO DO 
Redefine menu behavior on resize
*/


import Header from '@/components/Header' //importing component Header as Header | @ is a shortcut/alias for the src folder
import Landing from '@/components/Landing' //importing component Landing as Landing

export default { // ? what is that "export default" for | /*export default is modularizing the javascript code for the component. Its creates a scope for this component. But it's a singular vue object which attending hooks, methods and properties that vue has predefined in its prototype. We surdefined their default behavior if needed to suits our needs*/
  name: 'App',// name to identify component. Useful in router/index.js mainly. Not really needed here tho
  components : {
    'pg-header' : Header,    // app header | key of object defines the tag name that is going to bind component template to the template section, value is the name of the 
    'pg-landing' : Landing   // app landing
  },
  mounted(){
    // ? Burger vs Menu manager 
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
  /* All style typed there will be available for all the components as its in the App.vue  */
  @import '../node_modules/bulma/css/bulma.css';/* bulma library made available, allows use of class and whatever*/

  html, body{
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
   min-height: 60%;
   top:5.5%;
   left:12.5%;
   width: 75%;
  }
</style>
