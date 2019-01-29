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
          {{ letters[currentNumber] }}
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
                  @input="disassembleUserInput"
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
      </div>
    </div>
    <div id="test-input-div">
      <InvalidLabel
            :condition="userInputInvalidLabelOn === true"
            :msg="`자음 ${numbers.length}개를 입력하세요.`"
            size="massive"
      />
    </div>
  </div>
</template>

<script>
  import { disassemble } from 'hangul-js';
  import { isKoreanConsonantList } from '../../utils/inputCheck';
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
        userInputRaw: '',
        userInputValid: true,
        invalidSubmit: false,

        audio: getAudio().letter,
        letters: '_ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ',
        letterNumbers: {
          ㄱ: 1,
          ㄴ: 2,
          ㄷ: 3,
          ㄹ: 4,
          ㅁ: 5,
          ㅂ: 6,
          ㅅ: 7,
          ㅇ: 8,
          ㅈ: 9,
          ㅊ: 10,
          ㅋ: 11,
          ㅌ: 12,
          ㅍ: 13,
          ㅎ: 14,
        },
        answerStr: '',
        showAnswer: false,
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
      // userInput() {
      //   return disassemble(this.userInputRaw);
      // },
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
          const userInputArray = this.userInput.map(e => this.letterNumbers[e]);
          this.onTest = true;
          if (this.practice === true) {
            this.showAnswer = true;
            setTimeout(() => {
              this.showAnswer = false;
              this.handleSubmit(userInputArray);
            }, this.interval);
          } else {
            this.handleSubmit(userInputArray);
          }
        }
      },
      focusInput(e) { // focus to input element if other element is clicked
        if (e) e.preventDefault();
        if (typeof this.$refs.inp !== 'undefined') {
          this.$refs.inp.focus();
        }
      },
      disassembleUserInput(e) {
        const disassembled = disassemble(e.target.value);
        e.target.value = disassembled.join('');
        this.userInput = disassembled;
        this.$nextTick(() => {
          if (typeof this.$refs.inp !== 'undefined') {
            this.$refs.inp.selectionStart = e.target.value.length;
            this.$refs.inp.selectionEnd = e.target.value.length + 1;
          }
        });
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
            this.answerStr = this.answer.map(e => this.letters[e]).join('');
          }
        },
      },
      userInput(val) {
        if (!isKoreanConsonantList(val) || val.length > this.numbers.length) {
          this.userInputValid = false;
        } else {
          this.userInputValid = true;
          this.invalidSubmit = false;
        }
      },
    },
  };
</script>