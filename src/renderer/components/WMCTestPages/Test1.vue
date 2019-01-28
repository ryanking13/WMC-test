<template>
  <div @click="focusInput">
    <div id="test-div">
      <div id="test-div-elem">
        <h1
          v-if="visible === true"
          id="testletter"
          is="sui-header"
          size="massive"
          textAlign="center"
        >
          {{ currentNumber }}
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
        <div v-if="onTest === false" class="">
          <sui-form size="massive">
            <sui-form-field>
                <input
                  class="centered-input"
                  ref="inp" 
                  autofocus
                  @keydown.enter="submit"
                  @input="userInput = $event.target.value"
                  :placeholder="answerStr"
                  id="input-massive"
                />
            </sui-form-field>
          </sui-form>
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
      'answer',
      'interval',
      'hideInterval',
      'handleSubmit',
      'practice',
      'message',
    ],
    components: {
      InvalidLabel,
    },
    data() {
      return {
        onTest: true,
        visible: true,
        currentIndex: -1,

        userInput: '',
        userInputValid: true,
        invalidSubmit: false,

        audio: getAudio().number,
        answerStr: '',
      };
    },
    computed: {
      currentNumber() {
        // this.onTest = true;
        return this.numbers[this.currentIndex];
      },
      userInputInvalidLabelOn() {
        return this.userInputValid === false || this.invalidSubmit === true;
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
      focusInput(e) { // focus to input element if other element is clicked
        if (e) e.preventDefault();
        if (typeof this.$refs.inp !== 'undefined') {
          this.$refs.inp.focus();
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
      userInput(val) {
        if (!isDigit(val) || val.length > this.numbers.length) {
          this.userInputValid = false;
        } else {
          this.userInputValid = true;
          this.invalidSubmit = false;
        }
      },
    },
  };
</script>