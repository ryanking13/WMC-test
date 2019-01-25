<template>
  <div id="wrapper">
    <div id="titles">
      <h1 is="sui-header" id="title" textAlign="center" size="huge" color="blue">{{ explanation }}</h1>
      <MovePageButton :route="nextRoute" msg="시작" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        default: 1,
      },
    },
    data() {
      return {
        testId: 0,
        explanation: '',
      }
    },
    created() {
      const cfg = window.$cookies.get(`test${this.id}-config`);
      this.testId = this.id;
      this.explanation = cfg.explanationMessage;
      console.log(this.explanation);
    },
  }
</script>
