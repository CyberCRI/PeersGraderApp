<template>
  <div id="app">
    <div class="pg-layoutContent">
      <div class="pg-fullWidthContainer">
        <section class="pg-pagesContainer pg-floatingPage">
          <div id="pg-wizardGeneralInformationPage">
              <div class="pg-pageBorder">
                <div class="pg-pageShadow">
                  <div class="pg-pageContent">
                    <div class="pg-header">
                      <pg-header></pg-header>
                    </div>
                    <notifications group="notifications"/>
                    <router-view></router-view>
                  </div>
                </div>
              </div>
          </div>
        </section>
      </div>
    </div>
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
  
  html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td, article, aside, canvas, details, embed, figure, figcaption, footer, header, hgroup, main, menu, nav, output, ruby, section, summary, time, mark, audio, video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: roboto;
    vertical-align: baseline;
  }

  html,body{
    height: 100%
  }

  #app{
   display: flex;
   flex:1;
   flex-direction: column;
   border:solid 1px black;

  }

  .pg-layoutContent{
    text-align: center;
    justify-content: center;
    display:flex;
    align-items: center;
  }

  .pg-fullWidthContainer{
    display: flex;
    position:relative;
    z-index:1;
    border:solid 1px black;
  }

  #pg-wizardGeneralInformationPage{
    height: auto;
    min-height: 0;
  }

  .pg-pagesContainer{
    position:relative;
    max-width: 834px;
    min-width: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: row;
    flex:1;
    text-align: initial;
    z-index:2;
  }

  .pg-pageBorder{
    height: auto;
    border-radius: 10px;
    border: 4px solid rgba(255,255,255,0.25);
  }

  .pg-pageShadow{

  }

  .pg-pageContent{
    /*linear-gradient(to bottom, rgba(1,1,1,0.93) 0%, rgba(100,70,255,0.93) 100%)*/
    background-image: url("../static/images/peopleshade2.png");
    background-size:contain;
    background-position: 100% 100%;
    background-repeat:no-repeat;
    display: flex;
    background-size:313px 386px;
    flex-direction: column;
    max-width: 100vw;
  }

</style>
