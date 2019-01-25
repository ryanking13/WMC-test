<template>
  <div id="wrapper">
    <!-- <img id="logo" src="~@/assets/logo.png" alt="electron-vue"> -->
    <div id="titles">
      <h1 is="sui-header" id="title" textAlign="center" size="huge" color="blue">작업기억 검사가 모두 끝났습니다.</h1>
      <h1 is="sui-header" textAlign="center" size="huge">수고 많으셨습니다.</h1>
      <MovePageButton route="/" msg="검사 종료"/>
    </div>
  </div>
  
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import { saveResult } from '../utils/io';

  export default {
    name: 'outro-page',
    components: { MovePageButton },
    methods: {
    },
    created() {
      const user = window.$cookies.get('user');
      const result = window.$cookies.get('test-result');
      console.log(result);
      saveResult(user, result);
    },
  };
</script>