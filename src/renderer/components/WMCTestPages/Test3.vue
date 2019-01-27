<template>
  <div>
    <div id="test-div">
      <div id="test-div-elem">
        <sui-grid>
          <sui-grid-row v-for="r in 4" :key="`row${r}`">
            <sui-grid-column v-for="c in 4" :key="`col${c}`">
              <sui-segment></sui-segment>
            </sui-grid-column>
          </sui-grid-row>
        </sui-grid>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: [
      'numbers',
      'answer',
      'interval',
      'hideInterval',
      'handleSubmit',
      'practice',
    ],
    components: {
    },
    data() {
      return {
        onTest: true,
        visible: true,
        currentIndex: -1,

        userInput: '',
        userInputValid: true,
        invalidSubmit: false,

        answerStr: '',
      };
    },
    computed: {
      currentNumber() {
        return this.numbers[this.currentIndex];
      },
    },
    methods: {
      changeNumbers(c) {
        // if not visible, make it visible
        if (this.visible === false) {
          this.visible = true;
  
          if (typeof this.currentNumber !== 'undefined') this.audio[this.currentNumber].play();
          // TODO: play audio
          setTimeout(() => {
            this.changeNumbers(c);
          }, this.interval);
        } else {
          // if visible, change number, and make it invisible
          this.visible = false;
          setTimeout(() => {
            if (c > 0) {
              c -= 1;
              this.currentIndex += 1;
              this.changeNumbers(c);
            } else {
              this.onTest = false;
              this.$nextTick(() => {
                this.$refs.inp.focus();
              });
            }
          }, this.hideInterval);
        }
      },
      submit(e) {
        if (e) e.preventDefault();

        // if length does not match, consider it as invalid
        if (this.userInput.length !== this.numbers.length) {
          this.invalidSubmit = true;
        } else {
          // submit user input
          const userInputArray = this.userInput.toString(10).split('');
          this.handleSubmit(userInputArray.map(e => parseInt(e, 10)));
          this.onTest = true;
        }
      },
    },
    watch: {
      // when numbers prop is received, start new test
      numbers: {
        immediate: true,
        handler() {
          this.currentIndex = -1;
          this.onTest = true;
          // this.changeNumbers(this.numbers.length);
        },
      },
      answer: {
        immediate: true,
        handler() {
          if (this.practice === true) {
            this.answerStr = this.answer.join('');
          }
        },
      },
    },
  };
</script>