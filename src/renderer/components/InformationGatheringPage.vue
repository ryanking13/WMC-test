<template>
  <div id="wrapper">
    <div class="center container verywide">
      <sui-grid class="info-grid" :columns="2" divided relaxed="very">
        <sui-grid-column>
          <sui-form>
            <h3 is="sui-header" id="tinytitle" size="large">학교명</h3>
            <sui-form-field inline>
              <sui-button
                :color="(schoolButtonSukgyeOn === true) ? 'orange' : 'blue'"
                size="big"
                @click="onClickSchoolButtonSukGye"
              >
                {{ globalCfg.defaultSchoolName }}
              </sui-button>
              <sui-button
                :color="(schoolButtonElseOn === true) ? 'orange' : 'blue'"
                size="big"
                @click="onClickSchoolButtonElse"
              >
                기타
              </sui-button>
            </sui-form-field>
            <sui-form-field>
              <input
                id="input-large"
                @keydown.enter="blockEnter"
                @input="schoolInput = $event.target.value"
                v-show="schoolButtonElseOn === true"
                placeholder="예) 석계"
              >
              <InvalidLabel
                :condition="schoolButtonElseOn === true && schoolInputValid === 0"
                size="big"
                msg="3 글자 이내로 입력하세요"
              />
            </sui-form-field>
            <h3 is="sui-header" id="tinytitle" size="large">학년반</h3>
            <sui-form-field inline>
              <sui-dropdown
                id="input-large"
                placeholder="학년"
                selection
                :options="gradeOptions"
                v-model="gradeInput"
              />
              <sui-dropdown
                id="input-large"
                placeholder="반"
                selection
                :options="classOptions"
                v-model="classInput"
              />
            </sui-form-field>
            <sui-form-field>
              <h3 is="sui-header" id="tinytitle" size="large">번호</h3>
              <input
                id="input-large"
                class="input-large"
                @keydown.enter="blockEnter"
                @input="numberInput = $event.target.value"
                placeholder="예) 01"
              />
              <InvalidLabel
                size="big"
                :condition="numberInputValid === 0"
                msg="01 ~ 99 사이의 숫자만 입력하세요"
              />
            </sui-form-field>
          </sui-form>
        </sui-grid-column>
        <sui-grid-column>
          <sui-form>
          <h3 is="sui-header" id="tinytitle" size="large">생년월</h3>
          <sui-form-field inline>
            <sui-dropdown
              id="input-large"
              placeholder="년"
              selection
              :options="birthYearOptions"
              v-model="birthYearInput"
            />
            <sui-dropdown
              id="input-large"
              placeholder="월"
              selection
              :options="birthMonthOptions"
              v-model="birthMonthInput"
            />
          </sui-form-field>
          <sui-form-field>
            <h3 is="sui-header" id="tinytitle" size="large">이름</h3>
            <input
              id="input-large-korean"
              @keydown.enter="blockEnter"
              @input="nameInput = $event.target.value"
              placeholder="예) 홍길동"
            >
            <InvalidLabel
              :condition="nameInputValid === 0"
              size="big"
              msg="이름은 한글 3글자 이내로 입력하세요"
            />
          </sui-form-field>
          <h3 is="sui-header" id="tinytitle" size="large">성별</h3>
          <sui-form-field inline>
            <sui-button
              :color="(sexButtonMaleOn === true) ? 'orange' : 'blue'"
              size="big"
              @click="onClickSexButtonMale"
            >
              남
            </sui-button>
            <sui-button
              :color="(sexButtonFemaleOn === true) ? 'orange' : 'blue'"
              size="big"
              @click="onClickSexButtonFemale"
            >
              여
            </sui-button>
          </sui-form-field>
        </sui-form>
      </sui-grid-column>
      </sui-grid>
      <MovePageButton :enabled="valid" :beforeMove="onClickNext" route='/test-selection' />
    </div>
  </div>
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import InvalidLabel from './BaseComponents/InvalidLabel';
  import { isDigit, isKorean } from '../utils/inputCheck';
  import { setState, getState } from '../utils/state';

  export default {
    name: 'information-gathering-page',
    components: {
      MovePageButton,
      InvalidLabel,
    },
    data() {
      return {
        schoolButtonSukgyeOn: false,
        schoolButtonElseOn: false,
        schoolInput: '',
        schoolInputValid: -1,

        gradeOptions: [
          { text: '1', value: 1 }, { text: '2', value: 2 }, { text: '3', value: 3 },
          { text: '4', value: 4 }, { text: '5', value: 5 }, { text: '6', value: 6 },
        ],
        gradeInput: 1,
        classOptions: [
          { text: '01', value: 1 }, { text: '02', value: 2 }, { text: '03', value: 3 },
          { text: '04', value: 4 }, { text: '05', value: 5 }, { text: '06', value: 6 },
          { text: '07', value: 7 }, { text: '08', value: 8 }, { text: '09', value: 9 },
          { text: '10', value: 10 }, { text: '11', value: 11 }, { text: '12', value: 12 },
          { text: '13', value: 13 }, { text: '14', value: 14 }, { text: '15', value: 15 },
          { text: '16', value: 16 }, { text: '17', value: 17 }, { text: '18', value: 18 },
          { text: '19', value: 19 },
        ],
        classInput: 1,

        numberInput: -1,
        numberInputValid: -1,

        birthYearOptions: [
          { text: '2006', value: 1 }, { text: '2007', value: 2 }, { text: '2008', value: 3 },
          { text: '2009', value: 4 }, { text: '2010', value: 5 }, { text: '2011', value: 6 },
          { text: '2012', value: 7 },
        ],
        birthYearInput: 2,
        birthMonthOptions: [
          { text: '01', value: 1 },
          { text: '02', value: 2 },
          { text: '03', value: 3 },
          { text: '04', value: 4 },
          { text: '05', value: 5 },
          { text: '06', value: 6 },
          { text: '07', value: 7 },
          { text: '08', value: 8 },
          { text: '09', value: 9 },
          { text: '10', value: 10 },
          { text: '11', value: 11 },
          { text: '12', value: 12 },
        ],
        birthMonthInput: 1,

        nameInput: '',
        nameInputValid: -1,

        sexButtonMaleOn: false,
        sexButtonFemaleOn: false,

        globalCfg: null,
      };
    },
    computed: {
      valid() {
        return (this.schoolButtonSukgyeOn || this.schoolInputValid === 1) &&
               this.numberInputValid === 1 &&
               this.nameInputValid === 1 &&
               (this.sexButtonMaleOn || this.sexButtonFemaleOn);
      },
    },
    watch: {
      schoolInput(val) {
        if (val.length > 0 && val.length <= 3) {
          this.schoolInputValid = 1;
        } else {
          this.schoolInputValid = 0;
        }
      },
      numberInput(val) {
        if (val.length > 2 || !isDigit(val)) {
          this.numberInputValid = 0;
        } else {
          this.numberInputValid = 1;
        }
      },
      nameInput(val) {
        if (val.length > 3 || val.length === 0 || !isKorean(val)) {
          this.nameInputValid = 0;
        } else {
          this.nameInputValid = 1;
        }
      },
    },
    methods: {
      onClickSchoolButtonSukGye(e) {
        if (e) e.preventDefault();
        this.schoolButtonSukgyeOn = true;
        this.schoolButtonElseOn = false;
      },
      onClickSchoolButtonElse(e) {
        if (e) e.preventDefault();
        this.schoolButtonSukgyeOn = false;
        this.schoolButtonElseOn = true;
      },
      onClickSexButtonMale(e) {
        if (e) e.preventDefault();
        this.sexButtonMaleOn = true;
        this.sexButtonFemaleOn = false;
      },
      onClickSexButtonFemale(e) {
        if (e) e.preventDefault();
        this.sexButtonMaleOn = false;
        this.sexButtonFemaleOn = true;
      },
      onClickNext() {
        const userCookie = {};
        const year = this.birthYearOptions.filter(e => e.value === this.birthYearInput)[0].text;
        const month = this.birthMonthOptions.filter(e => e.value === this.birthMonthInput)[0].text;
        userCookie.school = (this.schoolButtonSukgyeOn) ?
          this.globalCfg.defaultSchoolNameRepr : this.schoolInput;

        userCookie.grade = this.gradeInput;
        userCookie.class = this.classInput;
        userCookie.year = year;
        userCookie.month = month;
        userCookie.number = (this.numberInput.length === 2) ? this.numberInput : `0${this.numberInput}`;
        userCookie.name = this.nameInput;
        userCookie.sex = (this.sexButtonMaleOn) ? 'M' : 'F';
        // window.$cookies.set('user', userCookie);
        setState('user', userCookie);
      },
      blockEnter(e) {
        if (e) e.preventDefault();
      },
    },
    created() {
      this.globalCfg = getState('global-config');
    },
  };
</script>

<style>
  .info-grid {
  }
</style>
