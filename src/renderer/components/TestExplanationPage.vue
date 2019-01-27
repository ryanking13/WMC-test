<template>
  <div id="wrapper">
    <div id="titlesnomargin">
      <h1
        is="sui-header"
        id="title"
        textAlign="center"
        size="huge"
        color="blue"
        v-html="title"
      >
      </h1>
      <div class="center container wide">
        <h1
          is="sui-header"
          v-for="msg in msgs"
          :key="msg"
          textAlign="left"
          size="huge"
          v-html="msg"
        >
        </h1>
      </div>
      <MovePageButton :route="'/test/' + testId + '/practice'"/>
    </div>
  </div>
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import { getState } from '../utils/state';

  export default {
    props: {
      id: {
        default: 1,
      },
    },
    components: {
      MovePageButton,
    },
    data() {
      return {
        testId: 0,
        explanation: '',
      };
    },
    created() {
      // const cfg = window.$cookies.get(`test${this.id}-config`);
      const cfg = getState(`test${this.id}-config`);
      this.testId = this.id;
      this.title = cfg.testTitle;
      this.msgs = cfg.explanationMessages;
    },
  };
</script>
