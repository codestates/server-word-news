const express = require('express');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');
const db = require('../models/index');

const router = express.Router();

router.get('/:date', function(req, res) {
  let token = req.body.token;

  let decoded = jwt.verify(token, secretObj.secret);
  //console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', decoded);
  if (decoded) {
    if (req.params.date) {
      //날짜값이 있을 때 날짜에 해당하는 단어만 보여줌
    } else {
      //날짜값이 없을 때 모두 보여줌
      let user = await db.User.findOne({
        where: {
          user_name: decoded
        }, 
        raw:true
      })

      let user_id = user.id

      let books = await db.Book.findAll({
        where:{
          user_id : user_id
        },
        raw:true
      })

      let book_id = [];
      books.forEach(book =>{
        book_id.push(book.id)
      })

      let bookWords = await db.Book_Word.findAll({
        where:{
          book_id: book_id
        },
        raw: true
      })

      let word_id =[];
      bookWords.forEach(bookWord=>{
        word_id.push(bookWord.word_id)
      })

      let words = await db.Word.findAll({
        where: {
          id: word_id
        },
        raw : true
      })
      res.send(words);
    }
  } else {
    res.status(400).send('로그인 하세요');
  }
  // date에 맞는 test할 단어와 선지 목록을 응답한다.
  //res.send('get test date : ' + req.params.date);
});

module.exports = router;
