const express = require('express');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const db = require('../../models/index');

const stopWords = require('./stopwords');
const fetchHelper = require('./fetch');
const makeSentenceDataArray = require('./makeSentenceData');
const getNgramData = require('./ngram');

const krtSportsRss = 'https://www.koreatimes.co.kr/www/rss/sports.xml';

fetchHelper.retrieveS(krtSportsRss).then(xml => {
  let sportsArticleData = [];

  parser.parseString(xml, async (err, result) => {
    let rssInformation = result.rss.channel[0];
    let rssArticleList = result.rss.channel[0].item;
    let ArticleUrlList = rssArticleList.map(article => {
      return article.link[0];
    });
    let article_id = 1;

    rssArticleList.forEach(article => {
      let articleData = {};
      articleData.title = article.title[0];
      articleData.contenct = ''; //삭제해라 이따가
      articleData.date = article.pubdate[0];
      articleData.author = article.author[0];
      articleData.photoURL = article.enclosure
        ? article.enclosure[0].$.url
        : undefined;
      articleData.publisher = rssInformation.title[0];
      articleData.category_id = rssInformation.description[0];

      sportsArticleData.push(articleData);
    });
    console.log(sportsArticleData);

    sportsArticleData.forEach(articleData => {
      db.Article.create(articleData);
    });

    let sportsSentenceData = [];

    // 각 article별 sentencesData 가 완성된다

    // ArticleUrlList.forEach(url => {
    //   makeSentenceDataArray(url).then(result => {
    //     let sentenceIndex = 0;
    //     let sentencesData = result.map(sentence => {
    //       sentenceIndex++;
    //       return {
    //         text: sentence,
    //         article_id: 4,
    //         index: sentenceIndex
    //       };
    //     });
    //   });
    //   // 각 article별 sentencesData 가 완성된다
    // });

    let sportsWordData = [];

    //기사 하나만 word data 모으는 작업 이 함수에서 완성해라
    let sentences = await makeSentenceDataArray(ArticleUrlList[0]);
    let words = [];
    sentences.forEach(sentence => {
      words = words.concat(sentence.split(' '));
    });

    words = words.filter(word => {
      return !stopWords.includes(word);
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
    words = words.filter(word => {
      return !word.split('').includes("'");
    });
    for (let i = 0; i < words.length; i++) {
      let word = words[i];
      if (word[word.length - 1] === '.' || word[word.length - 1] === ',') {
        word = word.split('');
        word.pop();
        word = word.join('');
      }
      words[i] = word;
    }

    let wordsCopy = [...words];
    let i = 0;
    let ngramWordsList = [];

    while (wordsCopy.length > 0) {
      if (wordsCopy.length <= 50) {
        ngramWordsList[i] = [...wordsCopy];
      } else {
        ngramWordsList[i] = wordsCopy.slice(0, 50);
      }
      wordsCopy = wordsCopy.slice(50);
      i++;
    }

    let ngramWordsOutput = [];

    ngramWordsList.forEach(words => {
      let result = getNgramData(words);
      ngramWordsOutput.push(result);
    });

    let ngramResult = await Promise.all(ngramWordsOutput);

    ngramResult = ngramResult.reduce((acc, item) => {
      acc = acc.concat(item);
      return acc;
    }, []);

    let ngramWords = ngramResult.map(wordData => {
      let ngram = wordData.timeseries[0];
      let grade = 5;
      if (0.0000009 < ngram && ngram <= 0.000007) {
        grade = 4;
      } else if (0.000007 < ngram && ngram <= 0.00002) {
        grade = 3;
      } else if (0.00002 < ngram && ngram <= 0.0001) {
        grade = 2;
      } else if (0.0001 < ngram) {
        grade = 1;
      }
      return {
        word: wordData.ngram,
        translation: '',
        grade: grade
      };
    });
    console.log(ngramWords);

    function getWordMeaning(word) {
      return new Promise(async (res, rej) => {
        let url = `https://dict.naver.com/search.nhn?dicQuery=${word}&x=0&y=0&query=${word}&target=dic&ie=utf8&query_utf=&isOnlyViewEE=`;
        let html = await fetchHelper.retrieveS(url);
        let dom = new JSDOM(html);
        let meaning = dom.window.document.querySelector('.dic_search_result')
          .children[1].textContent;
        res(meaning);
      });
    }
    // let wordsData = ngramWords.map(async wordData => {
    //   let meaning = await getWordMeaning(wordData.word);
    //   wordData.translation = meaning;
    //   return wordData;
    // });
    // console.log(wordsData);
  });
});

module.exports = {};
