<template>
  <div>
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
        >
          본 순서대로 수를 입력하고 Enter를 누르세요.
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
      'interval',
      'handleSubmit',
    ],
    components: {
      InvalidLabel,
    },
    data() {
      return {
        onTest: true,
        visible: true,
        invisibleInterval: 500,
        currentIndex: -1,

        userInput: '',
        userInputValid: true,
        invalidSubmit: false,

        audio: getAudio().number,
      };
    },
    computed: {
      currentNumber() {
        this.onTest = true;
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
          }, this.invisibleInterval);
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
        }
      },
    },
    watch: {
      // when numbers prop is received, start new test
      numbers: {
        immediate: true,
        handler() {
          this.currentIndex = -1;
          this.changeNumbers(this.numbers.length);
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