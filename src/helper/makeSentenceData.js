const fetchHelper = require('./fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

async function makeSentenceDataArray(url) {
  return new Promise(async (res, rej) => {
    let html = await fetchHelper.retrieve(url);
    let dom = new JSDOM(html);

    let statementTags = dom.window.document.querySelector('#startts').children;
    let statements = [];

    for (let key in statementTags) {
      if (
        statementTags[key].tagName === 'SPAN' ||
        statementTags[key].tagName === 'BR'
      ) {
        if (statementTags[key].textContent && statementTags[key].children) {
          for (let key2 in statementTags[key].children) {
            statements.push(statementTags[key].children[key2].textContent);
          }
        }
      }
    }

    let sentences = [];

    statements.forEach(statement => {
      if (statement !== undefined) {
        sentences = sentences.concat(statement.split('.'));
      }
    });

    for (let i = 0; i < sentences.length; i++) {
      if (!(sentences[i] === '' || sentences[i] === ' ')) {
        sentences[i] = sentences[i] + '.';
      }
      if (sentences[i][0] === '"') {
        if (sentences[i].length === 1) {
          sentences[i - 1] = sentences[i - 1] + '"';
          sentences[i] = sentences[i] - '"';
        }
        if (sentences[i].length === 2) {
          sentences[i - 1] = sentences[i - 1] + '"';
          sentences[i] = sentences[i] - '".';
        } else if (sentences[i][1] === ' ') {
          sentences[i - 1] = sentences[i - 1] + '"';
          sentences[i] = sentences[i].split('');
          sentences[i].shift();
          sentences[i].shift();
          sentences[i] = sentences[i].join('');
        }
      }
    }

    sentences = sentences.filter(sentence => {
      return typeof sentence === 'string';
    });
    sentences = sentences.map(sentence => {
      return {
        text: sentence.trim(),
        article_id: '',
        index: ''
      };
    });
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i] === '' && sentences[i + 1] === '') {
        sentences.splice(i, 1);
      }
    }
    console.log(sentences);
    res(sentences);
  });
}

makeSentenceDataArray(
  'http://www.koreatimes.co.kr/www/nation/2019/04/281_266535.html'
);

module.exports = makeSentenceDataArray;
