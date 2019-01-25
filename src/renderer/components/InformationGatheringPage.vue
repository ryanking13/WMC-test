<template>
  <div id="wrapper">
    <div class="center container">
      <sui-form>
        <h3 is="sui-header" size="large">학교명</h3>
        <sui-form-field inline>
          <sui-button
            :color="(schoolButtonSukgyeOn === true) ? 'orange' : 'blue'"
            @click="onClickSchoolButtonSukGye"
          >
            석계
          </sui-button>
          <sui-button
            :color="(schoolButtonElseOn === true) ? 'orange' : 'blue'"
            @click="onClickSchoolButtonElse"
          >
            기타
          </sui-button>
        </sui-form-field>
        <sui-form-field>
            <input
              @keydown.enter="blockEnter"
              @input="schoolInput = $event.target.value"
              v-show="schoolButtonElseOn === true"
              placeholder="예) 석계"
            >
            <InvalidLabel
              :condition="schoolButtonElseOn === true && schoolInputValid === 0"
              msg="3 글자 이내로 입력하세요"
            />
        </sui-form-field>
        <h3 is="sui-header" size="large">학년반</h3>
        <sui-form-field inline>
          <sui-dropdown
            placeholder="학년"
            selection
            :options="gradeOptions"
            v-model="gradeInput"
          />
          <sui-dropdown
            placeholder="반"
            selection
            :options="classOptions"
            v-model="classInput"
          />
        </sui-form-field>
        <sui-form-field>
          <h3 is="sui-header" size="large">번호</h3>
          <input
            @keydown.enter="blockEnter"
            @input="numberInput = $event.target.value"
            placeholder="예) 01"
          >
          <InvalidLabel
            :condition="numberInputValid === 0"
            msg="01 ~ 99 사이의 숫자만 입력하세요"
          />
        </sui-form-field>
        <h3 is="sui-header" size="large">생년월</h3>
        <sui-form-field inline>
          <sui-dropdown
            placeholder="년"
            selection
            :options="birthYearOptions"
            v-model="birthYearInput"
          />
          <sui-dropdown
            placeholder="월"
            selection
            :options="birthMonthOptions"
            v-model="birthMonthInput"
          />
        </sui-form-field>
        <sui-form-field>
          <h3 is="sui-header" size="large">이름</h3>
          <input
            @keydown.enter="blockEnter"
            @input="nameInput = $event.target.value"
            placeholder="예) 홍길동"
          >
          <InvalidLabel
            :condition="nameInputValid === 0"
            msg="이름은 한글 3글자 이내로 입력하세요"
          />
        </sui-form-field>
        <h3 is="sui-header" size="large">성별</h3>
        <sui-form-field inline>
          <sui-button
            :color="(sexButtonMaleOn === true) ? 'orange' : 'blue'"
            @click="onClickSexButtonMale"
          >
            남
          </sui-button>
          <sui-button
            :color="(sexButtonFemaleOn === true) ? 'orange' : 'blue'"
            @click="onClickSexButtonFemale"
          >
            여
          </sui-button>
        </sui-form-field>
      </sui-form>
      <MovePageButton :enabled="valid" :beforeMove="onClickNext" route='/test-selection' />
    </div>
  </div>
</template>

<script>
  import MovePageButton from './BaseComponents/MovePageButton';
  import InvalidLabel from './BaseComponents/InvalidLabel';
  import { isDigit, isKorean } from '../utils/inputCheck.js';

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
        userCookie.school = (this.schoolButtonSukgyeOn) ? 'Sukgye' : this.schoolInput;
        userCookie.grade = this.gradeInput;
        userCookie.class = this.classInput;
        userCookie.year = year;
        userCookie.month = month;
        userCookie.number = (this.numberInput.length === 2) ? this.numberInput : `0${this.numberInput}`;
        userCookie.name = this.nameInput;
        userCookie.sex = (this.sexButtonMaleOn) ? 'M' : 'F';
        window.$cookies.set('user', userCookie);
      },
      blockEnter(e) {
        if (e) e.preventDefault();
      },
    },
  };
</script>