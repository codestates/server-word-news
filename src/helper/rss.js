const express = require('express');
const jsdom = require('jsdom');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const WordPOS = require('wordpos');
const wordpos = new WordPOS();
const stopWords = require('./stopwords');

const fetchHelper = require('./fetch');

const { JSDOM } = jsdom;

const nytHotRss = 'http://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml'; // nyt rss 기사 가져오려면 fetch파일 수정해야함 http모듈 사용하도록!(https 는 krt);
const krtSportsRss = 'https://www.koreatimes.co.kr/www/rss/sports.xml';

fetchHelper.retrieveS(krtSportsRss).then(xml => {
  let sportsArticleData = [];

  parser.parseString(xml, (err, result) => {
    let rssInformation = result.rss.channel[0];
    let rssArticleList = result.rss.channel[0].item;
    let ArticleUrlList = rssArticleList.map(article => {
      return article.link[0];
    });

    rssArticleList.forEach(article => {
      let articleData = {};

      articleData.title = article.title[0];
      articleData.date = article.pubdate[0];
      articleData.author = article.author[0];
      articleData.photoURL = article.enclosure[0].$.url;
      articleData.publisher = rssInformation.title[0];
      articleData.category_id = rssInformation.description[0];

      sportsArticleData.push(articleData);
    });

    let sportsSentenceData = [];

    async function makeSentenceDataArray(url) {
      let html = await fetchHelper.retrieve(url);
      let dom = new JSDOM(html);

      let statementTags = dom.window.document.querySelector('#startts')
        .children;
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
      sentences.forEach(item => {
        if (item.includes("'")) {
          //정규 표현식
        }
        //item에서 역슬래시 제거해야한다
        //prettier 때문에 저장하면 "\'"에서 "'"으로 자동 수정된다
        //그래서 includes("\'")로해서 item을 걸러낼 수가 없다
        //그래서 역슬래시를 제거 못하고 있다
        //어떻게하지?
        // console.log(item);
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
        return sentence.trim();
      });
      for (let i = 0; i < sentences.length; i++) {
        if (sentences[i] === '' && sentences[i + 1] === '') {
          sentences.splice(i, 1);
        }
      }
      return sentences;
    }

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
    let word = {
      id: 1,
      word: 'great',
      translation: '굉장함, 위대한, 큰',
      grade: 1
    };
    //기사 하나만 word data 모으는 작업 이 함수에서 완성해라
    makeSentenceDataArray(ArticleUrlList[0]).then(sentences => {
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

      console.log(words);
    });
  });
});

module.exports = {};
