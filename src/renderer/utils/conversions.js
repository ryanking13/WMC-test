export const pad1 = (n) => {
  if (n < 10) return `0${n}`;
  return n;
};

export const toDate = (d) => {
  const year = d.getFullYear();
  const month = pad1(d.getMonth() + 1);
  const date = pad1(d.getDate());
  return `${year}-${month}-${date}`;
};

export const toTime = (d) => {
  const hours = pad1(d.getHours());
  const minutes = pad1(d.getMinutes());
  const seconds = pad1(d.getSeconds());
  const milliseconds = d.getMilliseconds();
  const centiseconds = pad1(parseInt(milliseconds / 10, 10));
  return `${hours}:${minutes}:${seconds}.${centiseconds}`;
};

export const timeDiff = (t1, t2) => {
  let diff = t1 - t2;
  if (diff < 0) diff = -diff;
  return diff;
};
