/* @flow */

/**
 * pass in array of strings and shuffle them around
 */
export const shuffle = (array: Array<string>) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    // eslint-disable-next-line
      array[currentIndex] = array[randomIndex];
    // eslint-disable-next-line
      array[randomIndex] = temporaryValue;
  }
  return array;
};

const utils = {
  shuffle,
};

export default utils;
