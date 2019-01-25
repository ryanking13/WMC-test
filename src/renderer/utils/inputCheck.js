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
