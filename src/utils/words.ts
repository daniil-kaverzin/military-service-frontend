type Decls = string[];

export const declOfNum = (number: number, words: Decls) => {
  return words[
    number % 100 > 4 && number % 100 < 20
      ? 2
      : [2, 0, 1, 1, 1, 2][number % 10 < 5 ? number % 10 : 5]
  ];
};

export const getNumberWithText = (number: number, words: Decls) => {
  return `${number} ${declOfNum(number, words)}`;
};
