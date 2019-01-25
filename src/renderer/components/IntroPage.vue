<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div id="titles">
      <h1 is="sui-header" id="title" textAlign="center" size="huge" color="blue">작업기억 검사</h1>
      <h1 is="sui-header" id="smalltitle" textAlign="center" size="huge">초등학생용</h1>
      <MovePageButton :route="nextRoute" />
    </div>
  </div>
  
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import { loadConfig, loadTestConfig, loadAudio } from '../utils/io';
  import { registerAudio } from '../utils/audio';
  import { EnterMoveListener } from '../utils/eventListeners';

  export default {
    name: 'intro-page',
    components: { MovePageButton },
    data() {
      return {
        nextRoute: '/information-gathering',
        enterListener: null,
      };
    },
    methods: {
    },
    created() {
      this.enterListener = EnterMoveListener('keyup', this.$router, this.nextRoute);
      window.addEventListener('keyup', this.enterListener);

      const cfgFileName = 'WMCtest.cfg';
      const maxTests = 8;
      const cfg = loadConfig(cfgFileName, maxTests);
      const audios = loadAudio();
      registerAudio(audios);
  
      window.$cookies.set('tests', cfg);
      window.$cookies.set('current-test-id', 1);

      for (let i = 1; i <= 1; i += 1) {
        const cfg = loadTestConfig(i);
        window.$cookies.set(`test${i}-config`, cfg);
      }
    },
    beforeDestroy() {
      window.removeEventListener('keyup', this.enterListener);
    },
  };
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  h1 { font-size: 1rem; }
  body { font-family: 'Source Sans Pro', sans-serif; }

  #title { font-size: 6rem; }
  #smalltitle { font-size: 3rem; }
  #titles { margin: 20vh auto; }
  #little-margin { margin: 8% auto; }
  #tiny-margin { margin: 3% auto; }
  

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(245, 245, 245, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 30px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }

  .button.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    text-align: center;
    padding-top: 10%;
  }

  .center.container {
    display: block;
    flex-direction: column;
    width: 30vw;
    margin: auto;
    align-items: center;
    text-align: left;
  }

  .center.container.margin.top {
    padding-top: 20vh;
  }

  .center.container.wide {
    display: block;
    flex-direction: column;
    width: 50vw;
    margin: auto;
    padding-top: 5vh;
    padding-bottom: 5vh;
    align-items: center;
    text-align: left;
  }

  .flex-container {
    margin-top: 20vh;
  }

  .test.header {
    background-color: #D9E9FF;
    color: #D9E9FF;
    height: 15vh;
  }

  .centered-input {
    text-align: center;
  }

  
  #test-div {
    display: flex;
    padding-top: 10vh;
    padding-bottom: 10vh;
    height: 50vh;
    align-items: center;
    justify-content: center;
  }

  #test-input-div {
    display: flex;
    height: 10vh;
    align-items: center;
    justify-content: center;    
  }

  #test-div-elem {
    min-width: 50%;
    max-width: 80%;
  }

  #testletter {
    font-size: 35vh;
  }

  #testexplanation {
    font-size: 5vh;
  }

  .hide-cursor {
    cursor: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

</style>
