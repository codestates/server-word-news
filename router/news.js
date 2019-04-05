const express = require('express');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');
const getMeaning = require('../src/crawler/helper/getMeaning.js');
const router = express.Router();

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [
    this.getFullYear(),
    '-' + (mm > 9 ? '' : '0') + mm,
    '-' + (dd > 9 ? '' : '0') + dd
  ].join('');
};

router.get('/', function(req, res) {
  //카테고리에 맞는 기사목록과 ngram을 응답한다
  db.Article.findAll({
    where: {
      category_id: Number(req.query.categoryId)
    }
  }).then(result => {
    res.status(200).json(result);
  });
});

router.get('/:article_id', function(req, res) {
  //선택된 기사의 본문과 추천 단어를 응답한다.
  let newsContent = {};
  db.Article.findOne({
    where: {
      id: req.params.article_id
    },
    raw: true
  }).then(article => {
    newsContent.article = article;
    db.Sentence.findAll({
      where: {
        article_id: req.params.article_id
      },
      raw: true
    }).then(sentences => {
      let sentenceId = [];
      for (var i = 0; i < sentences.length; i++) {
        sentenceId.push(sentences[i].id);
      }

      newsContent.article.content = sentences;
      db.Word.findAll({
        where: {
          sentence_id: sentenceId
        },
        raw: true
      })
        .then(words => {
          newsContent.words = words;
          console.log('senten');
        })
        .then(() => {
          res.json(newsContent);
        });
    });
  });
});

// ?뒤에 쿼리가져올 수 없어서 :word_id로 수정
router.get('/:article_id/:word_id', function(req, res) {
  // 기사 본문에서 선택한 단어의 뜻을 응답한다.
});

router.post('/:article_id/word', function(req, res) {
  // 선택한 단어를 단어장에 저장하고 응답한다.
});

module.exports = router;
