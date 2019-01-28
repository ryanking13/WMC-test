<template>
  <div id="wrapper" :class="cursor">
    <sui-grid v-if="!delayed" textAlign="center">
      <sui-grid-row :columns='3'>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='large' color="teal">문제번호</h3>
            <h1 is='sui-header' size='large' id="input-up-massive">{{ currentTrialName }}</h1>
          </sui-segment>
        </sui-grid-column>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='large' color="teal">정답여부</h3>
            <h1 is='sui-header' size='large' id="input-up-massive">
              <span v-for="(match, idx) in matches" :key="`match${idx}`" color="black">
                <span v-if="match === 1" is="sui-header" color="green">O</span>
                <span v-else-if="match === 0" is="sui-header" color="red">X</span>
              </span>
            </h1>
          </sui-segment>
        </sui-grid-column>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='large' color="teal">{{ trialUnit }} 개수</h3>
            <h1 is='sui-header' size='large' id="input-up-massive">{{ currentTrialLength }}개</h1>
          </sui-segment>
        </sui-grid-column>
      </sui-grid-row>
    </sui-grid>

    <Test1
      v-if="testId === '1'"
      :numbers="currentTrial"
      :answer="currentAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :practice="testType === 'practice'"
      :message="inputExplanationMessage"
    />
    <Test2
      v-if="testId === '2'"
      :numbers="currentTrial"
      :answer="currentAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :practice="testType === 'practice'"
      :message="inputExplanationMessage"
    />
    <Test3
      v-if="testId === '3'"
      :numbers="currentTrial"
      :answer="currentAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :practice="testType === 'practice'"
    />
    <Test4
      v-if="testId === '4'"
      :numbers="currentTrial"
      :answer="currentAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :practice="testType === 'practice'"
    />
    <Test5
      v-if="testId === '5'"
      :numbers="currentTrial.number"
      :answerNumbers="currentAnswer"
      :sentences="currentTrial.sentence"
      :answerSentences="currentSubAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :setDelayed="setDelayed"
      :practice="testType === 'practice'"
      :message="inputExplanationMessage"
    />
  </div>
</template>

<script>
  import Test1 from './WMCTestPages/Test1';
  import Test2 from './WMCTestPages/Test2';
  import Test3 from './WMCTestPages/Test3';
  import Test4 from './WMCTestPages/Test4';
  import Test5 from './WMCTestPages/Test5';
  import { toDate, toTime, timeDiff } from '../utils/conversions';
  import { getState, setState } from '../utils/state';

  export default {
    props: {
      id: {
        default: 0,
      },
      type: {
        default: 'real', // practice/real
      },
    },
    components: {
      Test1, Test2, Test3, Test4, Test5,
    },
    data() {
      return {
        testId: 0,
        testType: 'real',
        trials: [],
        answers: [],
        trialUnit: '',
        trialsCount: 0,
        currentTrialIndex: 0,
        inputs: [],
        inputsSub: [],
        interval: 1000,
        hideInterval: 300,
        failCount: 0,
        matches: [],
        matchesSub: [],
        trialResults: [],
        hideCursor: false,
        delayed: false,

        cfg: null,
        testStartTime: null,
        testEndTime: null,
        trialStartTime: null,
        trialEndTime: null,
      };
    },
    computed: {
      currentTrialName() {
        if (this.testType === 'practice') return `연습${this.currentTrialIndex}`;
        return `${this.currentTrialIndex}`;
      },
      currentTrial() {
        return this.trials[this.currentTrialIndex - 1];
      },
      currentTrialLength() {
        if (typeof this.currentTrial.length === 'undefined') {
          return this.currentTrial.number.length;
        }
        return this.currentTrial.length;
      },
      currentAnswer() {
        let answer = this.answers[this.currentTrialIndex - 1];
        if (this.testId === '5') { // reading
          answer = answer.number;
        } else if (this.testId === '8') { // Symmetry
          answer = answer.matrix;
        }
        return answer;
      },
      currentSubAnswer() {
        let answer = this.answers[this.currentTrialIndex - 1];
        if (this.testId === '5') { // reading
          answer = answer.sentence;
        } else if (this.testId === '8') { // Symmetry
          answer = answer.image;
        }
        return answer;
      },
      cursor() {
        if (this.hideCursor === true) {
          return {
            'hide-cursor': true,
          };
        }
        return {};
      },
    },
    created() {
      // this.cfg = window.$cookies.get(`test${this.id}-config`);
      this.cfg = getState(`test${this.id}-config`);
      this.testId = this.id;
      this.testType = this.type;
      if (this.testType === 'practice') {
        this.trials = this.cfg.practiceQuestions;
        this.answers = this.cfg.practiceQuestionsAnswers;
      } else {
        this.trials = this.cfg.questions;
        this.answers = this.cfg.questionsAnswers;
      }

      this.trialUnit = this.cfg.trialUnit;
      this.trialsCount = this.trials.length;
      this.currentTrialIndex = 1;
      this.interval = this.cfg.interval;
      this.hideInterval = this.cfg.hideInterval;
      this.hideCursor = this.cfg.hideCursor;
      this.inputExplanationMessage = this.cfg.inputExplanationMessage;
      this.testStartTime = new Date();
      this.trialStartTime = new Date();
    },
    methods: {
      handleSubmit(userInput, userInputSub) {
        this.inputs = userInput;
        this.matches = this.inputs.map((e, i) => (e === this.currentAnswer[i] ? 1 : 0));

        if (typeof userInputSub !== 'undefined') {
          this.inputsSub = userInputSub;
          this.matchesSub = this.inputsSub.map((e, i) => (e === (this.currentSubAnswer[i]) ? 1 : 0));
        }

        // if it is real trial and every answer is wrong
        this.$nextTick(() => {
          const r = this.formatTrialResult();
          this.trialResults.push(r);

          if (this.testType !== 'practice' && this.matches.some(e => e === 0)) {
            this.failCount += 1;
          } else {
            this.failCount = 0;
          }

          // if 3 consecutive fails, end test
          if (this.failCount === 3) {
            this.finishTest();
          } else if (this.currentTrialIndex < this.trialsCount) {
            // if trial is left, go to next trial
            this.trialStartTime = new Date();
            this.currentTrialIndex += 1;
          } else {
            this.finishTest();
          }
        });
      },
      formatTrialResult() {
        this.trialEndTime = new Date();
        const result = {};

        result.testId = this.cfg.name;
        result.testDate = toDate(this.testStartTime);
        result.testStartTime = toTime(this.testStartTime);
        result.trialNo = this.currentTrialIndex;
        result.trialQuestion = this.currentAnswer.map(e => e);
        result.trialResponse = this.inputs.map(e => e);
        result.trialLoad = result.trialQuestion.length;
        result.anuPoints = this.matches.every(e => e === 1) ? 1 : 0;
        result.anlPoints = result.trialLoad * result.anuPoints;
        result.trialResult = result.anuPoints === 1 ? 'success' : 'failure';
        result.trialStartTime = toTime(this.trialStartTime);
        result.trialEndTime = toTime(this.trialEndTime);
        result.trialDurationTime = timeDiff(this.trialStartTime, this.trialEndTime);

        // test 5 or 8 needs special columns
        if (this.testId === '5' || this.testId === '8') {
          result.interAnswer = this.currentSubAnswer.map(e => (e === true ? 1 : 0));
          result.interResponse = this.inputsSub.map(e => (e === true ? 1 : 0));
          result.interPoints = this.matchesSub.every(e => e === 1) ? 1 : 0;
          result.interResult = result.interPoints === 1 ? 'success' : 'failure';
        }

        return result;
      },
      setDelayed(v) {
        this.delayed = v;
      },
      finishTest() {
        if (this.testType === 'practice') {
          setTimeout(() => {
            this.$router.push(`/test-end-practice/${this.testId}`);
          }, this.interval);
        } else {
          const testEndTime = toTime(new Date());
          // const currentTestId = window.$cookies.get('current-test-id');
          const currentTestId = getState('current-test-id');
          const nextTestId = currentTestId + 1;
          // const testResult = window.$cookies.get('test-result');
          const testResult = getState('test-result');
          // test end time is calculated after all trials are ended
          const trialResults = this.trialResults.map((e) => {
            e.testEndTime = testEndTime;
            return e;
          });

          testResult[this.cfg.id] = trialResults;
  
          // window.$cookies.set('test-result', testResult);
          setState('test-result', testResult);
          // window.$cookies.set('current-test-id', nextTestId);
          setState('current-test-id', nextTestId);

          setTimeout(() => {
            this.$router.push('/test-selection');
          }, this.interval);
        }
      },
    },
  };
</script>