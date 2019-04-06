const fetchHelper = require('../helper/fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function makeNgramData(words) {
  return new Promise(async (resolve, reject) => {
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
    let ngramScript = dom.window.document.querySelector('#container')
      .children[10].innerHTML;
    eval(ngramScript.split(';')[0]);

    data[data.length - 1] = {
      ngram: words[words.length - 1],
      type: 'NGRAM',
      timeseries: data[data.length - 2].timeseries, // 앞의 단어 grade
      parent: ''
    };

    resolve(data);
  });
}

module.exports = makeNgramData;
