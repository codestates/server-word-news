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
  // Object.keys(rss).forEach(async key => {    key => rssKey 다시 원상태로 바꿔라
  async function test(rssKey) {
    let categoryDataIn = await db.Category.findAll({
      where: {
        name: rssKey
      }
    });
    let categoryId = categoryDataIn[0].dataValues.id;

    let xml = await fetchHelper.retrieve(rss[rssKey]);

    parser.parseString(xml, async (err, result) => {
      let rssArticleList = result.rss.channel[0].item;

      rssArticleList.forEach(async article => {
        let articleData = {
          title: article.title[0],
          date: new Date(),
          author: article.author[0],
          photoURL: article.enclosure ? article.enclosure[0].$.url : undefined,
          category_id: categoryId
        };

        let articleDataIn = await db.Article.create(articleData);
        let articleId = articleDataIn.dataValues.id;
        let url = article.link[0];

        let sentenceIndex = 0;
        let sentencesData = await makeSentenceDataArray(url);

        sentencesData.forEach(async sentenceData => {
          sentenceData.index = sentenceIndex;
          sentenceData.article_id = articleId; // 여기서 then 값으로 article table 해라
          sentenceIndex++;

          let sentenceDataIn = await db.Sentence.create(sentenceData);
          let sentenceId = sentenceDataIn.dataValues.id;
          let words = sentenceDataIn.dataValues.text.split(' ');

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
              word[word.length - 1] === ')'
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
              word[word.length - 2] === '.'
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

          wordsData = words.map(async word => {
            return {
              word: word,
              translation: '',
              ngram: '',
              grade: '',
              setence_id: sentenceId
            };
          });

          // let wordsCopy = [...words];
          // let index = 0;
          // let ngramWordsList = [];

          // while (wordsCopy.length > 0) {
          //   if (wordsCopy.length <= 50) {
          //     ngramWordsList[index] = [...wordsCopy];
          //   } else {
          //     ngramWordsList[index] = wordsCopy.slice(0, 50);
          //   }
          //   wordsCopy = wordsCopy.slice(50);
          //   index++;
          // }

          // let ngramWordsOutput = [];
          // ngramWordsList.forEach(words => {
          //   let result = getNgramData(words);
          //   ngramWordsOutput.push(result);
          // });

          // let ngramResult = await Promise.all(ngramWordsOutput);
          // ngramResult = ngramResult.reduce((acc, item) => {
          //   acc = acc.concat(item);
          //   return acc;
          // }, []);

          // let ngramWords = ngramResult.map(wordData => {
          //   let ngram = wordData.timeseries[0];
          //   let grade = 5;
          //   if (0.0000009 < ngram && ngram <= 0.000007) {
          //     grade = 4;
          //   } else if (0.000007 < ngram && ngram <= 0.00002) {
          //     grade = 3;
          //   } else if (0.00002 < ngram && ngram <= 0.0001) {
          //     grade = 2;
          //   } else if (0.0001 < ngram) {
          //     grade = 1;
          //   }

          //   return {
          //     word: wordData.ngram,
          //     translation: '',
          //     ngram: ngram,
          //     grade: grade,
          //     setence_id: 1
          //   };
          // });
        });
      });
    });
  }
  test('world');
  // });
}

crawler();

module.exports = {};
