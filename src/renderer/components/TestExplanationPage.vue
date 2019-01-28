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
      <div class="center container wide" id="no-pad-bottom">
        <h1
          is="sui-header"
          v-for="msg in msgs"
          :key="msg"
          textAlign="left"
          size="big"
          v-html="msg"
          id="explanation-message"
        >
        </h1>
      </div>
    </div>
    <MovePageButton
      :route="'/test/' + testId + '/practice'"
      id="no-margin-button"
    />
  </div>
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import { getState } from '../utils/state';
  import { getAudio } from '../utils/audio';

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
        audio: getAudio().testDesc,
      };
    },
    created() {
      // const cfg = window.$cookies.get(`test${this.id}-config`);
      const cfg = getState(`test${this.id}-config`);
      this.testId = this.id;
      this.title = cfg.testTitle;
      this.msgs = cfg.explanationMessages;
      if (typeof this.audio !== 'undefined') {
        this.audio[this.testId].play();
      }
    },
    beforeDestroy() {
      if (typeof this.audio !== 'undefined') {
        this.audio[this.testId].stop();
      }
    },
  };
</script>

<style>
  #explanation-message {
    font-size: 2.4rem;
    margin-bottom: 0vh;
  }

  #no-margin-button {
    margin-top: 0vh;
  }

  #no-pad-bottom {
    padding-bottom: 0vh;
  }
</style>

