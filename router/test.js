const express = require('express');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');
const db = require('../models/index');

const router = express.Router();

router.post('/', async function(req, res) {
  let token = req.body.token;
  let decoded = jwt.verify(token, secretObj.secret);

  if (decoded) {
    let user = await db.User.findOne({
      where: {
        user_name: decoded.id
      }
    }).catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

    let user_id = user.dataValues.id;

    let books = await db.Book.findAll({
      where: {
        user_id: user_id
      }
    }).catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
    //console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', books);

    let book_id = [];
    books.forEach(book => {
      book_id.push(book.dataValues.id);
    });

    let bookWords = await db.Book_Word.findAll({
      where: {
        book_id: book_id
      }
    }).catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

    let word_id = [];
    bookWords.forEach(bookWord => {
      word_id.push(bookWord.dataValues.word_id);
    });

    let words = await db.Word.findAll({
      where: {
        id: word_id
      }
    }).catch(err => {
      console.log(err);
      res.sendStatus(400);
    });

    let result = [];

    for (let i = 0; i < words.length; i++) {
      let quizWord = {
        word: '',
        translations: [],
        answer: '',
        grade: ''
      };

      let answer = Math.floor(Math.random() * 5);
      quizWord.word = words[i].word;
      quizWord.translations[answer] = words[i].translation;
      quizWord.answer = answer;
      quizWord.grade = words[i].grade;
      result.push(quizWord);
    }

    for (let i = 0; i < result.length; i++) {
      // let gradeWord = await db.Word.findAll({
      //   grade: result[i].grade
      // });

      //console.log(gradeWord);
      let translations = result[i].translations;

      for (let i = 0; i < 5; i++) {
        if (!translations[i]) {
          translations[i] = '--------------------------';
        }
      }
    }
    res.send(result);
  } else {
    res.status(400).send('로그인 하세요');
  }
  // date에 맞는 test할 단어와 선지 목록을 응답한다.
  //res.send('get test date : ' + req.params.date);
});

module.exports = router;
