<template>
  <div id="wrapper">
    <div id="titlesnomargin">
      <h1 is="sui-header" id="title" textAlign="center" size="huge" color="blue"></h1>
      <div class="center container wide title">
        <h1 is="sui-header" textAlign="center" size="huge">
          지금부터는 점수가 기록됩니다.
        </h1>
        <h1 is="sui-header" textAlign="center" size="huge">
          끝까지 집중해서 입력하시기 바랍니다.
        </h1>
        <h1 is="sui-header" textAlign="center" size="huge">
          연습문제를 모두 틀린 경우
        </h1>
        <h1 is="sui-header" textAlign="center" size="huge">
          손을 들어 표시해주세요. 
        </h1>
      </div>
      <div class="centered-box">
        <sui-grid :columns="2" textAlign="center">
          <sui-grid-row>
            <sui-grid-column>
            <MovePageButton
              :route="'/test/' + testId + '/real'"
              msg="검사 시작"
              color="blue"
            />
            </sui-grid-column>
            <sui-grid-column>
            <MovePageButton
              :route="'/test/' + testId + '/practice'"
              msg="한번 더 연습하기"
              color="olive"
            />
            </sui-grid-column>
          </sui-grid-row>
        </sui-grid>
      </div>
    </div>
  </div>
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';

  export default {
    props: {
      id: {
        default: 1,
      },
    },
    components: {
      MovePageButton,
    },
    data() {
      return {
        testId: 0,
        explanation: '',
      };
    },
    created() {
      this.testId = this.id;
    },
  };
</script>
