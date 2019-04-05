const express = require('express');
const db = require('../models/index');

const router = express.Router();

router.get('/', function(req, res) {
  //카테고리에 맞는 기사목록과 ngram을 응답한다
  db.Article.findAll({
    where: {
      category_id: req.cookies.categoryId
    }
  }).then(result => {
    res.status(200).res.json(result);
  });
});

router.get('/:article_id', function(req, res) {
  //선택된 기사의 본문과 추천 단어를 응답한다.
  let newsContent = {};
  db.Sentence.findAll({
    where: {
      article_id: req.params.article_id
    }
  }).then(sentences => {
    newsContent.article = sentences;
    //res.json(newsContent);
    db.Sentence.findAll({ attributes: ['id'] }).then(result => {
      res.json(result);
    });
  });
});

// ?뒤에 쿼리가져올 수 없어서 :word_id로 수정
router.get('/:article_id/:word_id', function(req, res) {
  // 기사 본문에서 선택한 단어의 뜻을 응답한다.
  res.send(
    'get news article id && word id : ' +
      req.params.article_id +
      ' && ' +
      req.params.word_id
  );
});

router.post('/:article_id/word', function(req, res) {
  // 선택한 단어를 단어장에 저장하고 응답한다.
  res.send('get news : ' + req.params.article_id + '/word id');
});

module.exports = router;
