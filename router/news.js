const express = require('express');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');
const getMeaning = require('../src/crawler/helper/getMeaning');
const router = express.Router();

router.get('/', function(req, res) {
  //카테고리에 맞는 기사목록과 ngram을 응답한다
  db.Article.findAll({
    where: {
      category_id: Number(req.query.categoryId)
    }
  })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
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
  })
    .then(article => {
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
          })
          .catch(err => {
            console.log(err);
            res.sendStatus(400);
          });
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

// ?뒤에 쿼리가져올 수 없어서 :word_id로 수정
router.get('/:article_id/:word', async function(req, res) {
  // 기사 본문에서 선택한 단어의 뜻을 응답한다.
  let wordData = await db.Word.findOne({
    where: {
      word: req.params.word
    }
  });
  let word = wordData.dataValues.word;
  let meaning = await getMeaning(req.params.word);
  res
    .send({
      word_id: req.params.word_id,
      word: word,
      translation: meaning,
      sentence_id: wordData.dataValues.sentence_id
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

router.post('/:article_id/word', async function(req, res) {
  // 선택한 단어를 단어장에 저장하고 응답한다.
  let token = req.cookies.user;
  let word = req.body.word;

  let decoded = jwt.verify(token, secretObj.secret);
  let { Book, User, Book_Word, Word } = db;
  let userData = await User.findOne({
    //user_name 받아와서 id 찾는다
    where: {
      user_name: decoded.id
    }
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  });

  let date1 = new Date();
  date = date1.yyyymmdd();

  let bookData = await Book.findOne({
    where: {
      user_id: userData.dataValues.id,
      date: date
    }
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
  if (bookData === null) {
    Book.create({
      user_id: userData.dataValues.id,
      date: date
    }).then(async bookData => {
      let book_wordData = await Book_Word.findOne({
        where: {
          word_id: req.body.word_id
        }
      });
      if (book_wordData === null) {
        Book_Word.create({
          word_id: req.body.word_id,
          book_id: bookData.dataValues.id,
          complete: 0
        })
          .then(() => {
            res.send(`saving success!`);
          })
          .catch(err => {
            res.send(err);
          });
      } else {
        res.send(`you already saved that word`);
      }
    });
  } else {
    let book_wordData = await Book_Word.findOne({
      where: {
        word_id: req.body.word_id
      }
    });
    if (book_wordData === null) {
      Book_Word.create({
        word_id: req.body.word_id,
        book_id: bookData.dataValues.id,
        complete: 0
      })
        .then(() => {
          res.send(`saving success!`);
        })
        .catch(err => {
          res.send(err);
        });
    } else {
      res.send(`you already saved that word`);
    }
  }
});

module.exports = router;
