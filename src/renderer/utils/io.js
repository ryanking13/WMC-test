import { isDigitStrict } from './inputCheck';

// load config file (WMCtest.cfg)
export const loadConfig = (cfgFileName, maxTests) => {
  const fs = require('fs');
  let f;
  const cfg = [];
  // try both EUC-KR and UTF-8 encoding
  try {
    f = fs.readFileSync(cfgFileName, 'euc-kr');
  } catch (e) {
    try {
      f = fs.readFileSync(cfgFileName, 'utf-8');
    } catch (e) {
      // if both fail, consider config file not exists, return default [1, .. , maxTests(8)]
      for (let i = 1; i <= maxTests; i += 1) {
        cfg.push(i);
      }
      return cfg;
    }
  }

  let tests = f.split('\n');
  tests = tests.map(e => e.trim()); // trim whitespace letters
  tests = tests.filter(e => isDigitStrict(e[0]));
  tests = tests.map(e => parseInt(e[0], 10));
  tests = tests.filter(e => e > 0 || e <= maxTests); // 1 ~ `maxTests(8)` are only allowed numbers
  return tests.slice(0, maxTests); // use first `maxTests(8)` tests
};

// repr array for csv format
const dumpArray = arr => `"[${arr}]"`.replace(',', ', ');


const formatResultType1 = (user, result) => {
  const type1Header = 'school.name,grade.class,number,name,birth.year.month,sex,test.id,test.date,test.startTime,test.endTime,trial.No,trial.question,trial.response,trial.result,trial.load,ANU.points,ANL.points,trial.startTime,trial.endTime,trial.durationTime';
  const type1Tests = [1, 2, 3, 4, 6, 7];

  let s = type1Header;
  type1Tests.forEach((e) => {
    const key = `test${e}`;
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const r = result[key];
      s += '\n';
      s += `${user.school},${user.grade}${user.class},${user.number},${user.name},${user.year}${user.month},${user.sex},`;
      s += `${r.testId},${r.testDate},${r.testStartTime},${r.testEndTime},${r.trialNo},`;
      s += `${dumpArray(r.trialQuestion)},${dumpArray(r.trialResponse)},${r.trialResult},${r.trialLoad},`;
      s += `${r.anuPoints},${r.anulPoints},${r.trialStartTime},${r.trialEndTime},${r.trialDurationTime}`;
    }
  });
  return s;
};

const formatResultType2 = (user, result) => {
  const type2Header = 'school.name,grade.class,number,name,birth.year.month,sex,test.id,test.date,test.startTime,test.endTime,trial.No,trial.answer,trial.response,trial.result,trial.load,ANU.points,ANL.points,trial.startTime,trial.endTime,trial.durationTime,inter.answer,inter.response,inter.result,inter.points';
  const type2Tests = [5, 8];
  let s = type2Header;
  type2Tests.forEach((e) => {
    const key = `test${e}`;
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const r = result[key];
      s += '\n';
      s += `${user.school},${user.grade}${user.class},${user.number},${user.name},${user.year}${user.month},${user.sex},`;
      s += `${r.testId},${r.testDate},${r.testStartTime},${r.testEndTime},${r.trialNo},`;
      s += `${dumpArray(r.trialAnswer)},${dumpArray(r.trialResponse)},${r.trialResult},${r.trialLoad},`;
      s += `${r.anuPoints},${r.anulPoints},${r.trialStartTime},${r.trialEndTime},${r.trialDurationTime},`;
      s += `${dumpArray(r.interAnswer)},${dumpArray(r.interResponse)},${r.interResult},${r.interPoints}`;
    }
  });
  return s;
};

export const saveResult = (user, result) => {
  const d = new Date();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hour = d.getHours();
  const minute = d.getMinutes();
  const seconds = d.getSeconds();
  const title = `${user.school}_${user.grade}_${user.class}_${user.number}_${month}_${date}_${hour}${minute}${seconds}`;
};
