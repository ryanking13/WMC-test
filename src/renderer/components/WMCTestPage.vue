<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <h1 is="sui-header" textAlign="center" size="standard">WMC Test</h1>
    <div class="container">
      <!-- <personal-information></personal-information> -->
      <sample-test></sample-test>
    </div>
    <!-- <div>
      <sui-button
        color="black"
        circular size="massive"
        @click="onClick"
      >
        시작하기
      </sui-button>
    </div> -->
  </div>
</template>

<script>
  import PersonalInformation from './WMCTestPage/PersonalInformation';
  import SampleTest from './WMCTestPage/SampleTest';
  export default {
    name: 'intro-page',
    components: { PersonalInformation, SampleTest },
    methods: {
      open(link) {
        this.$electron.shell.openExternal(link);
      },
      onClick() {
        this.$router.push('/');
      },
    },
  };
</script>
