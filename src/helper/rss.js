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

          let ngramResult = await getNgramData(words);

          wordsData = words.map(async word => {
            let wordData = {
              word: word,
              translation: '',
              grade: '',
              setence_id: sentenceId
            };
            for (let i = 0; i < ngramResult.length; i++) {
              if (ngramResult[i].ngram === word) {
                let ngram = ngramResult[i].timeseries[0];
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
                wordData.grade = grade;
              }
            }
            let wordDataIn = await db.Word.create(wordData);
            return wordData;
          });
        });
      });
    });
  }
  test('world');
  // });
}

crawler();

module.exports = {};
