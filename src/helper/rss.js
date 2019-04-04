const express = require('express');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const db = require('../../models/index');

const fetchHelper = require('./fetch');
const getGrade = require('./grade');
const rss = require('./rssData');
const stopWords = require('./stopwords');
const wordsFilter = require('./wordsFilter');
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
          sentenceData.article_id = articleId;
          sentenceIndex++;

          let sentenceDataIn = await db.Sentence.create(sentenceData);
          let sentenceId = sentenceDataIn.dataValues.id;
          let beforeWords = sentenceDataIn.dataValues.text.split(' ');

          let words = wordsFilter(beforeWords);

          let ngramResult = await getNgramData(words);

          words.forEach(async word => {
            let wordData = {
              word: word,
              translation: '',
              grade: '',
              sentence_id: sentenceId
            };
            for (let i = 0; i < ngramResult.length; i++) {
              if (ngramResult[i].ngram === word) {
                let ngram = ngramResult[i].timeseries[0];
                let grade = getGrade(ngram);
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
