const fetchHelper = require('./fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

let fakeWords = [
  'competing',
  'win',
  'include',
  'professionals',
  'three',
  'amateur',
  'golfers.',
  'one',
  'can',
  'predict',
  'will',
  'win',
  'trophy',
  'tournaments',
  'scheduled',
  'take',
  'place',
  'season.',
  'player',
  'winning',
  'trophy'
];

async function makeNgramData(words) {
  function makeURL(wordsArray) {
    let first = '';
    let second = '';
    for (let i = 0; i < wordsArray.length; i++) {
      first = first + wordsArray[i] + '%2C';
      second = second + `t1%3B%2C${wordsArray[i]}%3B%2Cc0%3B.`;
    }
    let url = `https://books.google.com/ngrams/graph?content=${first}&year_start=2007&year_end=2008&corpus=15&smoothing=50&share=&direct_url=${second}`;
    url = url.split('');
    url.pop();
    return url.join('');
  }

  const html = await fetchHelper.retrieveS(makeURL(words));
  const dom = new JSDOM(html);
  let ngramScript = dom.window.document.querySelector('#container').children[10]
    .innerHTML;
  eval(ngramScript.split(';')[0]);

  return data;
}

// makeNgramData(fakeWords).then(data => {
//   console.log(data);
// });

module.exports = makeNgramData;
