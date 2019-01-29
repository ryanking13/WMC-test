import { remote } from 'electron';
import { Howl } from 'howler';
import iconv from 'iconv-lite';
import path from 'path';
import { isDigitStrict } from './inputCheck';
import { pad1 } from './conversions';

iconv.skipDecodeWarning = true;

// load config file (WMCtest.cfg)
export const loadConfig = (cfgFileName, maxTests) => {
  const fs = require('fs');
  let f;
  const cfg = { tests: [] };
  // try both EUC-KR and UTF-8 encoding
  try {
    f = fs.readFileSync(cfgFileName, 'utf-8');
  } catch (e) {
    try {
      f = fs.readFileSync(cfgFileName, 'binary');
      f = iconv.decode(f, 'euc-kr');
    } catch (e) {
      // if both fail, consider config file not exists, return default [1, .. , maxTests(8)]
      for (let i = 1; i <= maxTests; i += 1) {
        cfg.tests.push(i);
      }
      return cfg;
    }
  }

  let tests = f.split('\n');
  tests = tests.map(e => e.trim()); // trim whitespace letters
  tests = tests.filter(e => isDigitStrict(e[0]));
  tests = tests.map(e => parseInt(e[0], 10));
  tests = tests.filter(e => e > 0 || e <= maxTests); // 1 ~ `maxTests(8)` are only allowed numbers
  cfg.tests = tests.slice(0, maxTests); // use first `maxTests(8)` tests
  return cfg;
};

export const loadTestConfig = (testId) => {
  const fs = require('fs');
  const cfgFileName = path.join(__static, `config/Test${testId}cfg.json`);
  let f;

  // try both EUC-KR and UTF-8 encoding
  try {
    f = fs.readFileSync(cfgFileName, 'utf-8');
  } catch (e) {
    try {
      f = fs.readFileSync(cfgFileName, 'binary');
      f = iconv.decode(f, 'euc-kr');
    } catch (e) {
      // if both fail, consider config file not exists
      const { dialog } = remote;
      dialog.showMessageBox({ type: 'error', message: `${cfgFileName} 파일이 존재하지 않습니다.` });
      window.close();
    }
  }

  let cfg;
  try {
    cfg = JSON.parse(f);
  } catch (e) {
    // JSON parsing failed
    const { dialog } = remote;
    dialog.showMessageBox({ type: 'error', message: `${cfgFileName} 파일이 올바른 JSON 문법이 아닙니다.` });
    window.close();
  }

  return cfg;
};

// load audio(number, letter) files
export const loadAudio = () => {
  const audios = { number: ['DUMMY'], letter: ['DUMMY'], testDesc: ['DUMMY'] };
  let file = '';
  for (let i = 1; i <= 9; i += 1) {
    try {
      file = path.join(__static, `/audio/number_${i}.mp3`);
      // file = `audio/number_${i}.mp3`;
      const sound = new Howl({
        src: [file],
      });
      audios.number.push(sound);
    } catch (e) {
      const { dialog } = remote;
      dialog.showMessageBox({ type: 'error', message: `음성 파일 ${file} 로드에 실패했습니다.` });
      window.close();
    }
  }

  for (let i = 1; i <= 14; i += 1) {
    try {
      file = path.join(__static, `/audio/letter_${i}.mp3`);
      // file = `audio/number_${i}.mp3`;
      const sound = new Howl({
        src: [file],
      });
      audios.letter.push(sound);
    } catch (e) {
      const { dialog } = remote;
      dialog.showMessageBox({ type: 'error', message: `음성 파일 ${file} 로드에 실패했습니다.` });
      window.close();
    }
  }

  // load test description files
  const maxTests = 8;
  for (let i = 1; i <= maxTests; i += 1) {
    try {
      file = path.join(__static, `/audio/test_desc_${i}.mp3`);
      const sound = new Howl({
        src: [file],
      });
      audios.testDesc.push(sound);
    } catch (e) {
      const { dialog } = remote;
      dialog.showMessageBox({ type: 'error', message: `음성 파일 ${file} 로드에 실패했습니다.` });
      window.close();
    }
  }

  return audios;
};

// load arrow and symmetry check images
export const loadImage = () => {
  const images = { arrow: [] };
  let file;
  for (let i = 0; i <= 8; i += 1) {
    try {
      file = path.join(__static, `/image/arrow_${i}.png`);
      const image = new Image();
      image.src = file;
      images.arrow.push(image);
    } catch (e) {
      const { dialog } = remote;
      dialog.showMessageBox({ type: 'error', message: `이미지 파일 ${file} 로드에 실패했습니다.` });
      window.close();
    }
  }
  return images;
};

// repr array for csv format
const dumpArray = arr => `"[${arr}]"`.replace(/,/g, ', ');

const formatResultType1 = (user, result) => {
  const type1Header = 'school.name,grade.class,number,name,birth.year.month,sex,test.id,test.date,test.startTime,test.endTime,trial.No,trial.question,trial.response,trial.result,trial.load,ANU.points,ANL.points,trial.startTime,trial.endTime,trial.durationTime';
  const type1Tests = [1, 2, 3, 4, 6, 7];

  let s = type1Header;
  type1Tests.forEach((e) => {
    const key = `test${e}`;
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      const resultArray = result[key];
      resultArray.forEach((r) => {
        s += '\n';
        s += `${user.school},${user.grade}${user.class},${user.number},${user.name},${user.year}${user.month},${user.sex},`;
        s += `${r.testId},${r.testDate},${r.testStartTime},${r.testEndTime},${r.trialNo},`;
        s += `${dumpArray(r.trialQuestion)},${dumpArray(r.trialResponse)},${r.trialResult},${r.trialLoad},`;
        s += `${r.anuPoints},${r.anlPoints},${r.trialStartTime},${r.trialEndTime},${r.trialDurationTime}`;
      });
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
      const resultArray = result[key];
      resultArray.forEach((r) => {
        s += '\n';
        s += `${user.school},${user.grade}${user.class},${user.number},${user.name},${user.year}${user.month},${user.sex},`;
        s += `${r.testId},${r.testDate},${r.testStartTime},${r.testEndTime},${r.trialNo},`;
        s += `${dumpArray(r.trialQuestion)},${dumpArray(r.trialResponse)},${r.trialResult},${r.trialLoad},`;
        s += `${r.anuPoints},${r.anlPoints},${r.trialStartTime},${r.trialEndTime},${r.trialDurationTime},`;
        s += `${dumpArray(r.interAnswer)},${dumpArray(r.interResponse)},${r.interResult},${r.interPoints}`;
      });
    }
  });
  return s;
};

export const saveResult = (user, result) => {
  const fs = require('fs');

  const d = new Date();
  const month = d.getMonth() + 1;
  const date = d.getDate();
  const hour = pad1(d.getHours());
  const minute = pad1(d.getMinutes());
  const seconds = pad1(d.getSeconds());
  const title = `${user.school}_${user.grade}_${user.class}_${user.number}_${month}_${date}_${hour}${minute}${seconds}`;

  const result1 = formatResultType1(user, result);
  const result2 = formatResultType2(user, result);
  const title1 = `${title}_1.csv`;
  const title2 = `${title}_2.csv`;

  fs.writeFileSync(title1, result1, 'utf-8');
  fs.writeFileSync(title2, result2, 'utf-8');
};
