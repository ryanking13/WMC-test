<template>
  <div>
    <div id="titlescenter" v-if="ready">
        <h1 is="sui-header" id="hugetitle" textAlign="center" size="huge">+</h1>
        <h1 is="sui-header" id="title" textAlign="center" size="huge">준비</h1>
    </div>
    <div id="test-vertical-div" v-if="!ready && !onImage">

      <div class="matrix-container" v-show="onTest === true && answerRevealed === false">
        <div class="matrix" v-for="r in 4" :key="`row${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`col${c}`">
            <sui-button
              class="matrix-button"
              disabled
              :basic="!isElementOn(r, c)"
              :color="elementColor(r, c)"
            >
            </sui-button>
          </div>
        </div>
      </div>

      <div class="matrix-container" v-show="userInputRevealed && onTest === false && answerRevealed === false" key="realinput">
        <div class="matrix" v-for="r in 4" :key="`rowreal${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`colreal${c}`">
            <sui-button
              class="matrix-button"
              @click="userInputClick(r, c)"
              :basic="!isUserInputClicked(r, c)"
              :color="userInputColor(r, c)"
            >
            </sui-button>
          </div>
        </div>
      </div>

      <div class="matrix-container" v-show="practice && answerRevealed" key="practicefakeinput">
        <div class="matrix" v-for="r in 4" :key="`rowreal${r}`">
          <div class="matrix-element" v-for="c in 4" :key="`colreal${c}`">
            <sui-button
              disabled
              basic
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
    <div id="test-symmetry-div" v-show="onImage">

      <div id="arrow-input-padded">
        <div id="arrow-input-element">
          <h1 id="not-symmetry-identifier" is="sui-header">비대칭</h1>
        </div>
        <div id="arrow-input-element">
          <v-icon :id="rightPressed ? 'invisible-icon': ''" name="arrow-left" :scale="leftButtonScale" color="red"/>
        </div>
      </div>

      <img
        :src="currentImage"
        id="test-symmetry-image"
      />
      <div id="arrow-input-padded">
        <div id="arrow-input-element">
          <v-icon :id="leftPressed ? 'invisible-icon': ''" name="arrow-right" :scale="rightButtonScale" color="blue"/>
        </div>
        <div id="arrow-input-element">
          <h1 id="symmetry-identifier" is="sui-header">대칭&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h1>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import path from 'path';

  export default {
    props: [
      'numbers',
      'answerNumbers',
      'images',
      'answerImages',
      'interval',
      'hideInterval',
      'handleSubmit',
      'practice',
      'setDelayed',
      'handleSubmitSub',
    ],
    components: {
    },
    data() {
      return {
        onTest: true,
        onImage: false,
        visible: true,
        currentIndex: -1,
        countdown: -1,

        userInput: [],
        userInputRevealed: false,
        userInputValid: true,
        userInputImage: [],
        invalidSubmit: false,

        answerStr: '',
        answerRevealed: false,

        leftButtonScale: 6,
        rightButtonScale: 6,
        rightPressed: false,
        leftPressed: false,

        ready: false,
        showNumber: false,
      };
    },
    computed: {
      currentNumber() {
        return this.numbers[this.currentIndex];
      },
      currentImage() {
        if (this.currentIndex === -1) {
          return '';
        }
        return path.join(__static, `/image/${this.images[this.currentIndex]}`);
      },
      currentAnswerImage() {
        return this.answerImages[this.currentIndex];
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

          setTimeout(() => {
            this.showImage(c);
            // this.changeNumbers(c);
          }, this.interval);
        } else {
          // if visible, change number, and make it invisible
          this.visible = false;
          setTimeout(() => {
            if (c > 0) {
              c -= 1;
              this.currentIndex += 1;
              this.showNumber = true;
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
        if (this.onImage === true || this.showNumber === false) {
          return false;
        }
        if (this.rc2idx(r, c) === this.currentNumber) {
          return true;
        }
        return false;
      },
      elementColor(r, c) {
        // additional condition for test8
        // for UX (not showing previous color when changing immediately after symmetry question)
        if (this.onImage === true || this.showNumber === false) {
          return 'grey';
        }

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
        const idx = this.userInput.indexOf(this.rc2idx(r, c));
        if (this.userInput.length < this.numbers.length &&
            idx === -1) {
          this.userInput = this.userInput.concat(this.rc2idx(r, c));
        } else if (this.userInput.length < this.numbers.length && idx > -1) {
          this.userInput = this.userInput.filter((e, i) => i !== idx);
        }
      },
      userInputColor(r, c) {
        if (this.userInput.indexOf(this.rc2idx(r, c)) === -1) {
          return 'grey';
        }
        return 'blue';
      },
      showAnswer(r, c) {
        if (this.practice === true && this.answerNumbers.indexOf(this.rc2idx(r, c)) !== -1) {
          return true;
        }
        return false;
      },
      showImage(c) {
        this.onImage = true;
        this.showNumber = false;
        this.countdown = c;
      },
      imageId() {
        if (this.onImage === true) {
          return 'test-symmetry-image';
        }
        return 'empty-image';
      },
      arrowKeyListener(e) {
        if (e) e.preventDefault();

        const RIGHT = 39;
        const LEFT = 37;

        // ignore if sentence is not showing
        if (this.onImage === false) {
          // do nothing
        } else if (e.keyCode === RIGHT || e.keyCode === LEFT) { // right/left
          // remove listener for preventing multiple keypress
          window.removeEventListener('keyup', this.arrowKeyListener);

          let inp = true;
          if (e.keyCode === LEFT) {
            inp = false;
          }

          // if (e.keyCode === RIGHT) {
          //   this.rightButtonScale = 10;
          //   this.rightPressed = true;
          // } else if (e.keyCode === LEFT) {
          //   this.leftButtonScale = 10;
          //   this.leftPressed = true;
          // }

          // setTimeout(() => {
          //   this.rightButtonScale = 8;
          //   this.leftButtonScale = 8;
          //   this.rightPressed = false;
          //   this.leftPressed = false;
          // }, this.interval);

          this.userInputImage.push(inp);
          this.visible = false;

          setTimeout(() => {
            this.handleSubmitSub(inp === this.currentAnswerImage ? 1 : 0);
            this.visible = true;
            this.onImage = false;
            // add listner again
            window.addEventListener('keyup', this.arrowKeyListener);
            this.changeNumbers(this.countdown);
          }, this.hideInterval);
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
              this.handleSubmit(this.userInput, this.userInputImage);
            }, this.interval);
          }, this.interval);
        } else {
          // submit user input
          // wait for interval to show input to user
          setTimeout(() => {
            this.userInputRevealed = false;
            this.handleSubmit(this.userInput, this.userInputImage);
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
              this.userInput = [];
              this.userInputImage = [];
              this.onTest = true;
              setTimeout(() => {
                this.changeNumbers(this.numbers.length, true);
              }, this.interval);
            }, this.interval * 2);
          }, this.interval);
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
      userInput: {
        immediate: true,
        handler() {
          if (this.userInput.length === this.numbers.length) {
            this.submit();
          }
        },
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

  #test-symmetry-image {
    margin-top: 15vh;
    transform: scale(1.4);
    margin-bottom: 5vh;
  }

  #test-vertical-div {
    display: flex;
    flex-direction: column;
    padding-top: 10vh;
    padding-bottom: 10vh;
    height: 50vh;
    align-items: center;
    justify-content: center;
  }

  #arrow-input-padded {
    padding-top: 5vh;
    display: flex;
    width: 70vw;
    align-items: center;
    justify-content: center;
    margin-left: 10vh;
    margin-right: 10vh;
  }

  #not-symmetry-identifier {
    color: #ff0000;
    font-size: 3rem;
  }

  #symmetry-identifier {
    color: #0000ff;
    font-size: 3rem;
  }

  #test-symmetry-div {
    display: flex;
    padding-top: 25vh;
    padding-bottom: 10vh;
    height: 50vh;
    align-items: center;
    justify-content: center;
  }


</style>