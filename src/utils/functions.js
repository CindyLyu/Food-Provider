export const numberWithCommas = x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const foodInfoArrayToString = arr => {
  let str = '';
  if (!arr) {
    str = '-';
  } else {
    for (let i = 0; i < arr.length; i++) {
      if (i === arr.length - 1) {
        str += arr[i];
      } else {
        str += `${arr[i]}、`;
      }
    }
  }
  return str;
};

export const patchDigit = num => {
  let str = num.toString();
  if (str.length === 1) {
    str = `0${str}`;
  }
  return str;
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const isEmailValid = email => email.indexOf('@') !== -1;
