const fetchHelper = require('./fetch');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

function getWordMeaning(word) {
  return new Promise(async (res, rej) => {
    let url = `https://dict.naver.com/search.nhn?dicQuery=${word}&x=0&y=0&query=${word}&target=dic&ie=utf8&query_utf=&isOnlyViewEE=`;
    let html = await fetchHelper.retrieveS(url);
    let dom = new JSDOM(html);
    let meaning = dom.window.document
      .querySelector('.dic_search_result')
      .children[1].textContent.trim();
    res(meaning);
  });
}

module.exports = getWordMeaning;
