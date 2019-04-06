const stopWords = require('../data/stopwords');

function wordsFilter(wordsArr) {
  let words = [...wordsArr];
  words = words.filter(word => {
    return !word.split('').includes("'");
  });
  words = words.filter(word => {
    return !(
      word === '' ||
      word[0].toUpperCase() === word[0] ||
      word.split('').some(str => {
        return '1234567890'.includes(str);
      })
    );
  });
  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (
      word[word.length - 1] === '.' ||
      word[word.length - 1] === ',' ||
      word[word.length - 1] === ')' ||
      word[word.length - 1] === ':' ||
      word[word.length - 1] === ';'
    ) {
      word = word.split('');
      word.pop();
      word = word.join('');
    } else if (word[0] === '.' || word[0] === ',' || word[0] === '(') {
      word = word.split('');
      word.unshift();
      word = word.join('');
    } else if (
      word[word.length - 1] === '"' &&
      (word[word.length - 2] === '.' || word[word.length - 2] === ',')
    ) {
      word = word.split('');
      word.pop();
      word.pop();
      word = word.join('');
    }
    words[i] = word;
  }
  words = words.filter(word => {
    return !stopWords.includes(word);
  });
  return words;
}

module.exports = wordsFilter;
