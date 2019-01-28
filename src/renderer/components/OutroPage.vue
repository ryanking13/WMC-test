<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div id="titles">
      <h1 is="sui-header" id="smalltitle" textAlign="center" size="huge" color="blue">작업기억 검사가 모두 끝났습니다.</h1>
      <h1 is="sui-header" id="tinytitle" textAlign="center" size="huge">수고 많으셨습니다.</h1>
    </div>
    <div class="button container" id="end-button-no-margin">
      <sui-button
        color="black"
        size="massive"
        @click="onClick"
        :disabled="!canClose"
      >
        검사 종료
      </sui-button>
    </div>
  </div>
  
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import { saveResult } from '../utils/io';
  import { getState } from '../utils/state';

  export default {
    name: 'outro-page',
    components: { MovePageButton },
    data() {
      return {
        canClose: false,
      };
    },
    created() {
      // const user = window.$cookies.get('user');
      // const result = window.$cookies.get('test-result');
      const user = getState('user');
      const result = getState('test-result');
      saveResult(user, result);
      this.canClose = true;
    },
    methods: {
      onClick() {
        window.close();
      },
    },
  };
</script>

<style>
  #end-button-no-margin {
  }
</style>
