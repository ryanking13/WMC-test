// digit or empty string
export const isDigit = (val) => {
  const re = /^\d*$/;
  return re.test(val);
};

// digit, not allow empty string
export const isDigitStrict = (val) => {
  const re = /^\d+$/;
  return re.test(val);
};

// korean string
export const isKorean = (val) => {
  const re = /^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+[\s]?[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]*$/;
  return re.test(val);
};

export const isKoreanConsonant = (val) => {
  const re = /^[ㄱ-ㅎ]+$/;
  return re.test(val);
};

export const isKoreanConsonantList = (val) => {
  const re = /^[ㄱ-ㅎ]+$/;
  return val.every(e => re.test(e));
};
