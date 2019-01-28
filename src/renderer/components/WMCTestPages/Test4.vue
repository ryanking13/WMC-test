<template>
  <div>
    <div id="test-div">

      <div class="matrix-container" v-if="onTest === true && answerRevealed === false">
        <div class="matrix" v-for="r in 4" :key="`row${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`col${c}`">
            <sui-button
              class="matrix-button"
              disabled
              :inverted="!isElementOn(r, c)"
              :color="elementColor(r, c)"
            >
            </sui-button>
          </div>
        </div>
      </div>

      <div class="matrix-container" v-if="userInputRevealed && onTest === false && answerRevealed === false" key="realinput">
        <div class="matrix" v-for="r in 4" :key="`rowreal${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`colreal${c}`">
            <sui-button
              class="matrix-button"
              @click="userInputClick(r, c)"
              :inverted="!isUserInputClicked(r, c)"
              :color="userInputColor(r, c)"
            >
            </sui-button>
          </div>
        </div>
      </div>

      <div class="matrix-container" v-if="practice && answerRevealed" key="practicefakeinput">
        <div class="matrix" v-for="r in 4" :key="`rowreal${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`colreal${c}`">
            <sui-button
              disabled
              inverted
              color="grey"
              class="matrix-button"
            >
            <div v-if="showAnswer(r, c)">
              <v-icon name="mouse-pointer" scale="3" color='blue'/>
            </div>
            </sui-button>
          </div>
        </div>
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

        userInput: [],
        userInputRevealed: false,
        userInputValid: true,
        invalidSubmit: false,

        answerStr: '',
        answerRevealed: false,
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
              this.userInputRevealed = true;
            }
          }, this.hideInterval);
        }
      },
      rc2idx(r, c) {
        return ((r - 1) * 4) + c;
      },
      isElementOn(r, c) {
        if (this.rc2idx(r, c) === this.currentNumber) {
          return true;
        }
        return false;
      },
      elementColor(r, c) {
        if (this.rc2idx(r, c) === this.currentNumber) {
          return 'blue';
        }
        return 'grey';
      },
      isUserInputClicked(r, c) {
        if (this.userInput.indexOf(this.rc2idx(r, c)) === -1) {
          return false;
        }
        return true;
      },
      userInputClick(r, c) {
        if (this.userInput.length < this.numbers.length &&
            this.userInput.indexOf(this.rc2idx(r, c)) === -1) {
          this.userInput = this.userInput.concat(this.rc2idx(r, c));
        }
      },
      userInputColor(r, c) {
        if (this.userInput.indexOf(this.rc2idx(r, c)) === -1) {
          return 'grey';
        }
        return 'blue';
      },
      showAnswer(r, c) {
        if (this.practice === true && this.answer.indexOf(this.rc2idx(r, c)) !== -1) {
          return true;
        }
        return false;
      },
      submit(e) {
        if (e) e.preventDefault();

        // if length does not match, consider it as invalid
        if (this.userInput.length !== this.numbers.length) {
          this.invalidSubmit = true;
        } else if (this.practice === true) {
          setTimeout(() => {
            this.answerRevealed = true;
            this.userInputRevealed = false;
            setTimeout(() => {
              this.answerRevealed = false;
              this.handleSubmit(this.userInput);
            }, this.interval);
          }, this.interval);
        } else {
          // submit user input
          // wait for interval to show input to user
          setTimeout(() => {
            this.userInputRevealed = false;
            this.handleSubmit(this.userInput);
          }, this.interval);
        }
      },
    },
    watch: {
      // when numbers prop is received, start new test
      numbers: {
        immediate: true,
        handler() {
          this.currentIndex = -1;
          this.userInput = [];
          this.onTest = true;
          setTimeout(() => {
            this.changeNumbers(this.numbers.length);
          }, this.interval);
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
      userInput: {
        immediate: true,
        handler() {
          if (this.userInput.length === this.numbers.length) {
            this.submit();
          }
        },
      },
    },
  };
</script>

<style>
  .matrix-container {
    margin-top: 25vh;
    height: 65vh;
    width: 65vh;
  }
  .matrix {
    display: flex;
    height: 25%;
    min-width: 100%;
    max-width: 100%;
  }

  .matrix-element {
    display: flex;
    min-width: 25%;
    max-width: 25%;
    height: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;  
  }

  .matrix-button {
    width: 90%;
    height: 90%;
  }
</style>