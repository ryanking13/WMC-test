<template>
  <div id="wrapper" class="hide-cursor">
    <sui-grid textAlign="center">
      <sui-grid-row :columns='3'>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='big'>문제번호</h3>
            <h3 is='sui-header' size='huge'>{{ currentTrialName }}</h3>
          </sui-segment>
        </sui-grid-column>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='big'>정답여부</h3>
            <h3 is='sui-header' size='large'>
              <span v-for="(match, idx) in matches" :key="`match${idx}`" color="black">
                <span v-if="match === 1" is="sui-header" color="green">O</span>
                <span v-else-if="match === 0" is="sui-header" color="red">X</span>
              </span>
            </h3>
          </sui-segment>
        </sui-grid-column>
        <sui-grid-column>
          <sui-segment class="test header">
            <h3 is='sui-header' size='big'>{{ trialUnit }} 개수</h3>
            <h3 is='sui-header' size='huge'>{{ currentTrialLength }}개</h3>
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
    />
    <Test2
      v-if="testId === '2'"
      :numbers="currentTrial"
      :answer="currentAnswer"
      :interval="interval"
      :hideInterval="hideInterval"
      :handleSubmit="handleSubmit"
      :practice="testType === 'practice'"
    />
  </div>
</template>

<script>
  import Test1 from './WMCTestPages/Test1';
  import Test2 from './WMCTestPages/Test2';
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
      Test1, Test2,
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
        interval: 1000,
        hideInterval: 300,
        failCount: 0,
        matches: [],
        trialResults: [],

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
        return this.currentTrial.length;
      },
      currentAnswer() {
        return this.answers[this.currentTrialIndex - 1];
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
      this.testStartTime = new Date();
      this.trialStartTime = new Date();
    },
    methods: {
      handleSubmit(userInput) {
        this.inputs = userInput;
        this.matches = this.inputs.map((e, i) => (e === this.currentAnswer[i] ? 1 : 0));

        // if it is real trial and every answer is wrong
        this.$nextTick(() => {
          const r = this.formatTrialResult();
          this.trialResults.push(r);

          if (this.testType !== 'practice' && this.matches.every(e => e === 0)) {
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

        return result;
      },
      finishTest() {
        if (this.testType === 'practice') {
          this.$router.push(`/test-end-practice/${this.testId}`);
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
          this.$router.push('/test-selection');
        }
      },
    },
  };
</script>