<template>
  <div id="wrapper">
    <div id="titlesnomargin">
      <h1 is="sui-header" id="smalltitle" textAlign="center" size="huge" color="blue">작업기억 검사</h1>
      <sui-grid textAlign="center">
        <sui-grid-row v-for="(testRow, idx) in testButtonsGrid" :key="idx">
          <sui-grid-column v-for="test in testRow" :key="test.key" :width="4">
            <MovePageButton
              color="blue"
              :msg="test.name"
              :enabled="test.id == currentTestId"
              :route="'/test-explanation/' + test.id"
            />
          </sui-grid-column>
        </sui-grid-row>
      </sui-grid>
      <h1 is="sui-header" textAlign="center">준비가 되면 {{currentTestName}} 버튼을 누르세요.</h1>
    </div>
    <MovePageButton route='/end' />
  </div>
</template>

<script>
import MovePageButton from './BaseComponents/MovePageButton';

export default {
  name: 'test-selection-page',
  components: {
    MovePageButton,
  },
  data() {
    return {
      currentTestId: 1,
      tests: [],
      testButtons: [
        { id: 1, key: 'test1', name: '검사1' },
        { id: 2, key: 'test2', name: '검사2' },
        { id: 3, key: 'test3', name: '검사3' },
        { id: 4, key: 'test4', name: '검사4' },
        { id: 5, key: 'test5', name: '검사5' },
        { id: 6, key: 'test6', name: '검사6' },
        { id: 7, key: 'test7', name: '검사7' },
        { id: 8, key: 'test8', name: '검사8' },
      ],
    };
  },
  computed: {
    currentTestName() {
      const t = this.testButtons.filter(e => e.id === this.currentTestId);
      return t[0].name;
    },
    testButtonsGrid() {
      const g = [];
      const rowNum = this.testButtons.length / 2;
      const colNum = this.testButtons.length / rowNum;
      for (let i = 0; i < rowNum; i += 1) {
        g.push(this.testButtons.slice(i * colNum, (i + 1) * colNum));
      }
      return g;
    },
  },
  created() {
    this.tests = window.$cookies.get('tests').tests;

    // check if finished all test
    const id = parseInt(window.$cookies.get('current-test-id'), 10);
    if (id > this.tests.length) {
      this.$router.push('/end');
    }
    this.currentTestId = id;
  },
};
</script>

