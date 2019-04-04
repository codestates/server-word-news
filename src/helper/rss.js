const express = require('express');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const db = require('../../models/index');

const fetchHelper = require('./fetch');
const rss = require('./rssData');
const stopWords = require('./stopwords');
const getNgramData = require('./ngram');
const makeSentenceDataArray = require('./makeSentenceData');

async function crawler() {
  Object.keys(rss).forEach(async key => {
    let xml = await fetchHelper.retrieve(rss[key]);

    let category = await db.Category.create({
      name: key
    });

    let artilesData = [];

    parser.parseString(xml, async (err, result) => {
      let rssInformation = result.rss.channel[0];
      let rssArticleList = result.rss.channel[0].item;

      rssArticleList.forEach(async article => {
        let articleData = {
          title: article.title[0],
          content: '',
          date: new Date(),
          author: article.author[0],
          photoURL: article.enclosure ? article.enclosure[0].$.url : undefined,
          publisher: rssInformation.title[0],
          category_id: category.dataValues.id
        };

        artilesData.push(articleData);
      });
      // articleData를 DB에 저장하기 위치 아래로 옮겨라
      // artilesData.forEach(articleData => {
      //   db.Article.create(articleData);
      // });

      /////articledata@@@ 처리하는것
      rssArticleList.forEach(async article => {
        // 여기서 article data를 db에 저장해라
        // 그 create의 return 값에서 article id 꺼내와라
        // 그걸로 돌려라
        let url = article.link[0];
        let sentenceIndex = 0;
        let sentences = await makeSentenceDataArray(url);
        let sentencesData = sentences.map(sentence => {
          sentence.index = sentenceIndex;
          sentence.article_id = 3;

          sentenceIndex++;
          return sentence;
        });

        let wordsData = [];
        let words = [];

        sentences.forEach(sentence => {
          // let wordList = sentence.split(' ');
          // wordList = wordList.map(word => {
          //   return;
          // });
          words = words.concat(sentence.text.split(' '));
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
        let index = 0;
        let ngramWordsList = [];

        while (wordsCopy.length > 0) {
          if (wordsCopy.length <= 50) {
            ngramWordsList[index] = [...wordsCopy];
          } else {
            ngramWordsList[index] = wordsCopy.slice(0, 50);
          }
          wordsCopy = wordsCopy.slice(50);
          index++;
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
            ngram: ngram,
            grade: grade,
            setence_id: 1
          };
        });

        function getWordMeaning(word) {
          return new Promise(async (res, rej) => {
            let url = `https://dict.naver.com/search.nhn?dicQuery=${word}&x=0&y=0&query=${word}&target=dic&ie=utf8&query_utf=&isOnlyViewEE=`;
            let html = await fetchHelper.retrieveS(url);
            let dom = new JSDOM(html);
            let meaning = dom.window.document.querySelector(
              '.dic_search_result'
            ).children[1].textContent;
            res(meaning);
          });
        }
        // let wordsData = ngramWords.map(async wordData => {
        //   let meaning = await getWordMeaning(wordData.word);
        //   wordData.translation = meaning;
        //   return wordData;
        // });
        /////articledata@@@ 처리하는것
      });
    });
  });
}

crawler();

module.exports = {};
