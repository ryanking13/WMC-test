<template>
  <div>
    <div id="test-div-vert">
      <div id="test-div-elem">
        <h1
          v-if="visible === true"
          id="testarrow"
          is="sui-header"
          size="massive"
          textAlign="center"
        >
          <img id="arrow-image" :src="currentImage" width="300" height="300" />
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
      <div class="arrow-container" key="realinput">
        <div class="arrow-row" v-for="r in 3" :key="`rowreal${r}`">
          <div class="" v-for="c in 3" :key="`colreal${c}`">
            <sui-button
              class=""
              id="arrow-button"
            >
              <img
                :src="image[rc2idx(r, c)].src"
                width="150"
                height="150"
                @mouseover="onMouseOverArrow(r, c)"
                @mouseleave="onMouseLeaveArrow(r, c)"
                @click="onMouseClickArrow(r, c)"
                :id="arrowState(r, c)"
              />
            </sui-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { isDigit } from '../../utils/inputCheck';
  import { getImage } from '../../utils/image';
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

        image: getImage().arrow,
        answerStr: '',
        showAnswer: false,

        arrowHovered: [false, false, false, false, false, false, false, false, false],
        arrowClicked: [false, false, false, false, false, false, false, false, false],
      };
    },
    computed: {
      currentNumber() {
        // this.onTest = true;
        return this.numbers[this.currentIndex];
      },
      currentImage() {
        if (this.currentNumber > 0) {
          return this.image[this.currentNumber].src;
        }
        return '';
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
            }
          }, this.hideInterval);
        }
      },
      rc2idx(r, c) {
        const idx = ((r - 1) * 3) + c;
        switch (idx) {
          case 1: return 7;
          case 2: return 8;
          case 3: return 1;
          case 4: return 6;
          case 5: return 0;
          case 6: return 2;
          case 7: return 5;
          case 8: return 4;
          case 9: return 3;
          default: return 0;
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
          this.onTest = true;
          if (this.practice === true) {
            this.showAnswer = true;
            setTimeout(() => {
              this.showAnswer = false;
              this.handleSubmit(userInputArray.map(e => parseInt(e, 10)));
            }, this.interval);
          } else {
            this.handleSubmit(userInputArray.map(e => parseInt(e, 10)));
          }
        }
      },
      focusInput(e) { // focus to input element if other element is clicked
        if (e) e.preventDefault();
        if (typeof this.$refs.inp !== 'undefined') {
          this.$refs.inp.focus();
        }
      },
      onMouseOverArrow(r, c) {
        const idx = this.rc2idx(r, c);
        this.arrowHovered = this.arrowHovered.map((e, i) => (i === idx ? true : e));
      },
      onMouseLeaveArrow(r, c) {
        const idx = this.rc2idx(r, c);
        this.arrowHovered = this.arrowHovered.map((e, i) => (i === idx ? false : e));
      },
      onMouseClickArrow(r, c) {
        const idx = this.rc2idx(r, c);
        this.arrowClicked = this.arrowClicked.map((e, i) => (i === idx ? true : e));
        if (this.userInput.indexOf(idx) !== -1) {
          this.userInput.push(idx);
        }
      },
      arrowState(r, c) {
        const idx = this.rc2idx(r, c);
        if (idx === 0) {
          return '';
        }

        if (this.arrowClicked[idx] === true) {
          return 'arrow-click';
        } else if (this.arrowHovered[idx] === true) {
          return 'arrow-hover';
        }
        return '';
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

<style>
  #test-div-vert {
    display: flex;
    padding-top: 10vh;
    padding-bottom: 10vh;
    flex-direction: column;
    height: 50vh;
    align-items: center;
    justify-content: center;
  }
  .arrow-container {
    margin-top: 25vh;
    height: 65vh;
    width: 65vh;
  }
  .arrow-row {
    display: flex;
    height: 33%;
    min-width: 100%;
    max-width: 100%;
  }

  .arrow-element {
    display: flex;
    min-width: 35%;
    max-width: 35%;
    height: 100%;
    text-align: center;
    align-items: center;
    justify-content: center;  
  }

  .matrix-button {
    width: 90%;
    height: 90%;
  }

  #arrow-button {
    background-color: transparent;
  }

  #arrow-hover {
    filter: invert(40%) sepia(10%) saturate(3154%) hue-rotate(342deg) brightness(95%) contrast(83%);
  }
  
  #arrow-click {
    filter: invert(63%) sepia(54%) saturate(1919%) hue-rotate(360deg) brightness(103%) contrast(103%);
  }
</style>
