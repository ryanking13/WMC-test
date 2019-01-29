<template>
  <div @click="focusInput" @keyup.right="handleArrow" @keyup.left="handleArrow" key="testbox">
    <div id="titlescenter" v-if="ready">
        <h1 is="sui-header" id="hugetitle" textAlign="center" size="huge">+</h1>
        <h1 is="sui-header" id="title" textAlign="center" size="huge">준비</h1>
    </div>
    <div id="test-div" v-if="!ready">
      <div id="test-div-elem">
        <h1
          v-if="visible === true && !onSentence"
          id="testletter"
          is="sui-header"
          size="massive"
          textAlign="center"
        >
          {{ currentNumber }}
        </h1>
        <h1
          v-if="onSentence"
          id="testsentence"
          is="sui-header"
          size="massive"
          textAlign="center"
        >
          {{ currentSentence }}
        </h1>
        <h1
          v-if="onTest === false"
          id="testexplanation"
          is="sui-header"
          size="massive"
          textAlign="center"
          v-html="message"
        >
        </h1>
      </div>
    </div>
    <div id="test-input-div">
      <div id="test-div-elem">
        <div v-if="onTest === false" class="" key="realinput">
          <sui-form size="massive">
            <sui-form-field>
                <input
                  class="centered-input"
                  ref="inp" 
                  autofocus
                  @keydown.enter="submit"
                  @input="userInput = $event.target.value"
                  id="input-massive"
                />
            </sui-form-field>
          </sui-form>
        </div>
        <div v-if="practice && showAnswer" class="" key="practicefakeinput">
          <sui-form size="massive">
            <sui-form-field>
                <input
                  v-if="focusInput"
                  disabled
                  class="centered-input"
                  :value="`정답: ${answerStr}`"
                  id="input-massive"
                  style="background-color: white; color: blue"
                />
            </sui-form-field>
          </sui-form>
        </div>
        <div v-if="onSentence" id="arrow-input">
          <div id="arrow-input-element">
            <v-icon :id="rightPressed ? 'invisible-icon': ''" name="times" :scale="leftButtonScale" color='red'/>
          </div>
          <div id="arrow-input-element">
            <v-icon :id="rightPressed ? 'invisible-icon': ''" name="arrow-left" :scale="leftButtonScale" color="red"/>
          </div>
          <div id="arrow-input-element"></div>
          <div id="arrow-input-element"></div>
          <div id="arrow-input-element">
            <v-icon :id="leftPressed ? 'invisible-icon': ''" name="arrow-right" :scale="rightButtonScale" color="blue"/>
          </div>
          <div id="arrow-input-element">
            <v-icon :id="leftPressed ? 'invisible-icon': ''" name="regular/circle" :scale="rightButtonScale" color='blue'/>
          </div>
        </div>
      </div>
    </div>
    <div id="test-input-div">
      <InvalidLabel
            :condition="userInputInvalidLabelOn === true"
            :msg="`숫자 ${numbers.length}개를 입력하세요.`"
            size="massive"
      />
    </div>
  </div>
</template>

<script>
  import { isDigit } from '../../utils/inputCheck';
  import { getAudio } from '../../utils/audio';
  import InvalidLabel from '../BaseComponents/InvalidLabel';
  export default {
    props: [
      'numbers',
      'answerNumbers',
      'sentences',
      'answerSentences',
      'interval',
      'hideInterval',
      'handleSubmit',
      'practice',
      'message',
      'setDelayed',
    ],
    components: {
      InvalidLabel,
    },
    data() {
      return {
        onTest: true,
        onSentence: false,
        visible: true,
        currentIndex: -1,
        countdown: -1,
        ready: false,

        userInput: '',
        userInputValid: true,
        invalidSubmit: false,
        userInputSentence: [],

        audio: getAudio().number,
        answerStr: '',
        showAnswer: false,

        leftButtonScale: 8,
        rightButtonScale: 8,
        rightPressed: false,
        leftPressed: false,
      };
    },
    computed: {
      currentNumber() {
        // this.onTest = true;
        return this.numbers[this.currentIndex];
      },
      currentSentence() {
        return this.sentences[this.currentIndex];
      },
      userInputInvalidLabelOn() {
        return this.userInputValid === false || this.invalidSubmit === true;
      },
    },
    methods: {
      changeNumbers(c, init) {
        // if init condition, make it visible
        if (init === true) {
          this.visible = true;
        }
        // if not visible, make it visible
        if (this.visible === false) {
          this.visible = true;
  
          if (typeof this.currentNumber !== 'undefined') this.audio[this.currentNumber].play();
          // TODO: play audio
          setTimeout(() => {
            this.showSentence(c);
            // this.changeNumbers(c);
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
      showSentence(c) {
        this.onSentence = true;
        this.countdown = c;
      },
      submit(e) {
        if (e) e.preventDefault();

        // if length does not match, consider it as invalid
        if (this.userInput.length !== this.numbers.length) {
          this.invalidSubmit = true;
        } else {
          // submit user input
          const userInputArray = this.userInput.toString(10).split('');
          this.onTest = true;
          if (this.practice === true) {
            this.showAnswer = true;
            setTimeout(() => {
              this.showAnswer = false;
              this.handleSubmit(userInputArray.map(e => parseInt(e, 10)), this.userInputSentence);
              this.userInputSentence = [];
            }, this.interval);
          } else {
            this.handleSubmit(userInputArray.map(e => parseInt(e, 10)), this.userInputSentence);
            this.userInputSentence = [];
          }
        }
      },
      focusInput(e) { // focus to input element if other element is clicked
        if (e) e.preventDefault();
        if (typeof this.$refs.inp !== 'undefined') {
          this.$refs.inp.focus();
        }
      },
      arrowKeyListener(e) {
        if (e) e.preventDefault();

        const RIGHT = 39;
        const LEFT = 37;

        // ignore if sentence is not showing
        if (this.onSentence === false) {
          // do nothing
        } else if (e.keyCode === RIGHT || e.keyCode === LEFT) { // right/left
          // remove listener for preventing multiple keypress
          window.removeEventListener('keyup', this.arrowKeyListener);

          let inp = true;
          if (e.keyCode === LEFT) {
            inp = false;
          }

          if (e.keyCode === RIGHT) {
            this.rightButtonScale = 10;
            this.rightPressed = true;
          } else if (e.keyCode === LEFT) {
            this.leftButtonScale = 10;
            this.leftPressed = true;
          }

          setTimeout(() => {
            this.rightButtonScale = 8;
            this.leftButtonScale = 8;
            this.rightPressed = false;
            this.leftPressed = false;
          }, this.interval);

          this.userInputSentence.push(inp);
          this.visible = false;

          setTimeout(() => {
            this.visible = true;
            this.onSentence = false;
            // add listner again
            window.addEventListener('keyup', this.arrowKeyListener);
            this.changeNumbers(this.countdown);
          }, this.interval);
        }
      },
    },
    watch: {
      // when numbers prop is received, start new test
      numbers: {
        immediate: true,
        handler() {
          setTimeout(() => {
            this.setDelayed(true);
            this.ready = true;
            setTimeout(() => {
              this.setDelayed(false);
              this.ready = false;
              this.currentIndex = -1;
              this.onTest = true;
              setTimeout(() => {
                this.changeNumbers(this.numbers.length, true);
              }, this.interval);
            }, this.interval * 2);
          }, this.interval);
          // this.setDelayed(true);
          // this.ready = true;
          // setTimeout(() => {
          //   this.setDelayed(false);
          //   this.ready = false;
          //   this.currentIndex = -1;
          //   this.onTest = true;
          //   setTimeout(() => {
          //     this.changeNumbers(this.numbers.length, true);
          //   }, this.interval);
          // }, this.interval * 2);
        },
      },
      answerNumbers: {
        immediate: true,
        handler() {
          if (this.practice === true) {
            this.answerStr = this.answerNumbers.join('');
          }
        },
      },
      userInput(val) {
        if (!isDigit(val) || val.length > this.numbers.length) {
          this.userInputValid = false;
        } else {
          this.userInputValid = true;
          this.invalidSubmit = false;
        }
      },
    },
    created() {
      window.addEventListener('keyup', this.arrowKeyListener);
    },
    beforeDestroy() {
      window.removeEventListener('keyup', this.arrowKeyListener);
    },
  };
</script>

<style>
  #arrow-input {
    display: flex;
    width: 50vw;
    align-items: center;
    justify-content: center;
    margin-left: 10vh;
    margin-right: 10vh;
  }

  #arrow-input-element {
    margin-left: 5%;
    margin-right: 5%;
  }

  #invisible-icon {
    visibility: hidden;
  }

</style>
