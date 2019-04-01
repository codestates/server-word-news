const express = require('express');
const jsdom = require('jsdom');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const WordPOS = require('wordpos');
const wordpos = new WordPOS();

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
    let sportsWordData = [];

    function makeSentenceDataArray(url) {
      return fetchHelper.retrieve(url).then(html => {
        let dom = new JSDOM(html);
        let content = dom.window.document.querySelector('#startts').children[1]
          .textContent;
        let title = dom.window.document.querySelector('.view_headline.HD')
          .textContent;
        // 여긴 문단 찾을때 써라
        let statementTags = dom.window.document.querySelector('#startts')
          .children; // 문단의 배열
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
        sentences.splice(0, 1);
        sentences.forEach(item => {
          if (item.includes('')) {
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
        console.log(sentences);
      });
    }

    makeSentenceDataArray(ArticleUrlList[0]);

    // ArticleUrlList.forEach(url => {
    //   fetchHelper.retrieve(url).then(html => {
    //     //요청 할떄마다 url 순서가 왜 바뀔까 -> 순서문제 해결하라!
    //     let dom = new JSDOM(html);
    //     let content = dom.window.document.querySelector('#startts').children[1]
    //       .textContent;
    //     let title = dom.window.document.querySelector('.view_headline.HD')
    //       .textContent;

    //     let sentence = {
    //       id: 3,
    //       text: 'hi everyone!',
    //       article_id: 4,
    //       index: 3
    //     };
    //     // 여긴 문단 찾을때 써라
    //     let statementTags = dom.window.document.querySelector('#startts')
    //       .children[1].children; // 문단의 배열
    //     // 첫번째 문단 콘솔찍기 : console.log(span1[1].textContent);
    //     statementTags.forEach(statementTag => {
    //       statementTag.textContent;
    //     });

    //     wordpos.getPOS(content, wordsResult => {
    //       let { nouns, verbs, adjectives, adverbs, rest } = wordsResult;

    //       let words = [...nouns, ...verbs, ...adjectives, ...adverbs];
    //       let uniqWords = [];

    //       words.forEach(word => {
    //         if (!uniqWords.includes(word)) {
    //           uniqWords.push(word);
    //         }
    //       });

    //       // let removeWords = rest.filter(word => {
    //       //   return (
    //       //     word[0].toUpperCase() === word[0] ||
    //       //     '0123456789'.includes(word[0])
    //       //   );
    //       // });
    //       // let filteredWords = uniqWords.filter(word => {
    //       //   return !removeWords.includes(word);
    //       // });
    //     });
    //   });
    // });
  });
});

// fetchHelper.retrieveArticle(nytRss).then(xml => {
//   parser.parseString(xml, (err, result) => {
//     let rssInformation = result.rss.channel[0];
//     let rssArticleList = result.rss.channel[0].item;
//     let ArticleUrlList = rssArticleList.map(article => {
//       return article.link[0];
//     });
//   });
// });

module.exports = {};
