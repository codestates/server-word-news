const db = require('../../models/index');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const fetchHelper = require('./helper/fetch');
const rss = require('./data/rss');
const filterWords = require('./helper/filterWords');
const getGrade = require('./helper/getGrade');
const getNgramData = require('./data/ngram');
const getSentencesData = require('./helper/getSentencesData');

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
        let sentencesData = await getSentencesData(url);

        sentencesData.forEach(async sentenceData => {
          sentenceData.index = sentenceIndex;
          sentenceData.article_id = articleId;
          sentenceIndex++;

          let sentenceDataIn = await db.Sentence.create(sentenceData);
          let sentenceId = sentenceDataIn.dataValues.id;
          let beforeWords = sentenceDataIn.dataValues.text.split(' ');

          let words = filterWords(beforeWords);

          // let ngramResult = await getNgramData(words);

          words.forEach(async word => {
            let wordData = {
              word: word,
              translation: '',
              grade: 1,
              sentence_id: sentenceId
            };
            // for (let i = 0; i < ngramResult.length; i++) {
            //   if (ngramResult[i].ngram === word) {
            //     let ngram = ngramResult[i].timeseries[0];
            //     let grade = getGrade(ngram);
            //     wordData.grade = grade;
            //   }
            // }
            let wordDataIn = await db.Word.create(wordData);
          });

          // sentence_id -> varchar 에서 int 로 바꿔라
        });
      });
    });
  }
  test('world');
  // });
}

crawler();

module.exports = {};
