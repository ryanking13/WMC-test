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
          style="margin-top: 5vh;"
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

      <div v-show="userInputRevealed && onTest === false && answerRevealed === false" class="arrow-container" key="realinput">
        <div class="arrow-row" v-for="r in 3" :key="`rowreal${r}`">
          <div class="" v-for="c in 3" :key="`colreal${c}`">
            <sui-button
              class=""
              compact
              id="arrow-button"
            >
              <img
                :src="imageCircle[rc2idx(r, c)].src"
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

      <div v-if="practice && answerRevealed" class="arrow-container" key="practicefaceinput">
        <div class="arrow-row" v-for="r in 3" :key="`rowreal${r}`">
          <div class="" v-for="c in 3" :key="`colreal${c}`">
            <sui-button
              class=""
              id="arrow-button"
              compact
            >
              <img
                v-if="rc2idx(r, c) !== 0"
                :src="imageCircle[rc2idx(r, c)].src"
                width="150"
                height="150"
                :id="answerArrowState(r, c)"
              />
              <sui-label id="arrow-answer-string" v-if="rc2idx(r, c) === 0">정답</sui-label>
            </sui-button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
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
        imageCircle: getImage().arrowCircle,
        answerStr: '',
        answerRevealed: false,
        userInputRevealed: false,

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
              this.userInputRevealed = true;
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
      onMouseOverArrow(r, c) {
        const idx = this.rc2idx(r, c);
        if (idx !== 0) {
          this.arrowHovered = this.arrowHovered.map((e, i) => (i === idx ? true : e));
        }
      },
      onMouseLeaveArrow(r, c) {
        const idx = this.rc2idx(r, c);
        if (idx !== 0) {
          this.arrowHovered = this.arrowHovered.map((e, i) => (i === idx ? false : e));
        }
      },
      onMouseClickArrow(r, c) {
        const idx = this.rc2idx(r, c);
        const inputIdx = this.userInput.indexOf(idx);
        if (idx !== 0) {
          if (this.userInput.length < this.answer.length && inputIdx === -1) {
            this.arrowClicked = this.arrowClicked.map((e, i) => (i === idx ? true : e));
            this.userInput = this.userInput.concat(idx);
          } else if (this.userInput.length < this.answer.length && inputIdx !== -1) {
            this.arrowClicked = this.arrowClicked.map((e, i) => (i === idx ? false : e));
            this.userInput = this.userInput.filter((e, i) => e !== idx);
          }
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
      answerArrowState(r, c) {
        const idx = this.rc2idx(r, c);
        if (idx === 0) {
          return '';
        }

        if (this.answer.indexOf(idx) !== -1) {
          return 'arrow-answer';
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
          this.userInput = [];
          this.arrowHovered = [false, false, false, false, false, false, false, false, false];
          this.arrowClicked = [false, false, false, false, false, false, false, false, false];
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

  #arrow-answer {
    filter: invert(83%) sepia(9%) saturate(6812%) hue-rotate(20deg) brightness(92%) contrast(101%);
  }

  #arrow-answer-string {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    background-color: transparent;
    font-size: 2.7rem;
    text-align: center;
    color: #A9CC00;
  }
</style>
