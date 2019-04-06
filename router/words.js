const express = require('express');
const router = express.Router();
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');

Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1;
  var dd = this.getDate();

  return [
    this.getFullYear(),
    '-' + (mm > 9 ? '' : '0') + mm,
    '-' + (dd > 9 ? '' : '0') + dd
  ].join('');
};

router.post('/:date', async function(req, res) {
  // date에 생성된 단어 목록을 응답한다.
  let { User, Book, Book_Word, Word } = db;
  let { token } = req.body;

  let decoded = jwt.verify(token, secretObj.secret);

  let userData = await User.findOne({
    where: {
      user_name: decoded.id
    }
  });

  if (req.params.date === undefined) {
    let booksData = await Book.findAll({
      where: {
        user_id: userData.dataValues.id
      }
    });
    booksData = JSON.parse(JSON.stringify(booksData));
    let book_wordsData = await Book_Word.findAll({
      where: {
        book_id: bookData.id
      }
    });
    let wordsData = [];
    booksData.forEach(async bookData => {
      let book_wordsData = await Book_Word.findAll({
        where: {
          book_id: bookData.id
        }
      });
      book_wordsData = JSON.parse(JSON.stringify(book_wordsData));
      book_wordsData.forEach(async book_wordData => {
        let wordData = Word.findOne({
          where: {
            id: book_wordData.word_id
          }
        });
        wordsData.push(wordData);
      });
    });
    console.log(wordsData);
  } else {
    let bookData = await Book.findOne({
      where: {
        user_id: userData.dataValues.id,
        date: req.params.date
      }
    });
    console.log('onebook');
    if (bookData === null) {
      res.statusCode = 404;
      res.end('you have to make wordbook first');
    }
    bookData = JSON.parse(JSON.stringify(bookData));
    let book_wordsData = await Book_Word.findAll({
      where: {
        book_id: bookData.id
      }
    });
    let wordsData = [];
    book_wordsData = JSON.parse(JSON.stringify(book_wordsData));
    book_wordsData.forEach(async book_wordData => {
      let wordData = Word.findOne({
        where: {
          id: book_wordData.word_id
        }
      });
      wordsData.push(wordData);
    });
    if (wordsData.length === 0) {
      res.statusCode = 404;
      res.end('cannot find any words');
    }
    Promise.all(wordsData).then(wordsData => {
      wordsData = JSON.parse(JSON.stringify(wordsData));
      result = wordsData.map(wordData => {
        console.log(bookData.id);
        wordData.wordbook_id = bookData.id;
        wordData.date = req.params.date;
        return wordData;
      });

      res.send(result);
    });
  }
});

router.post('/:wordbook_id/:word_id', function(req, res) {
  // 선택된 단어의 complete상태를 true로 저장하고 단어의 id를 응답한다.
  let { Book_Word } = db;
  let { word_id, wordbook_id } = req.params;

  Book_Word.update(
    {
      complete: 1
    },
    {
      where: {
        word_id: word_id,
        book_id: wordbook_id
      }
    }
  );

  res.send('change words id: ' + word_id);
});

router.post('/:wordbook_id/:word_id/sentence', async function(req, res) {
  // 단어장에서 선택한 단어의 뜻과 예문을 응답한다.
  let { Word, Book, Sentence } = db;
  let { word_id, wordbook_id } = req.params;

  let wordData = await Word.findOne({
    where: {
      id: word_id
    }
  });
  wordData = JSON.parse(JSON.stringify(wordData));
  let bookData = await Book.findOne({
    where: {
      id: wordbook_id
    }
  });
  bookData = JSON.parse(JSON.stringify(bookData));
  let sentenceData = await Sentence.findOne({
    where: {
      id: wordData.sentence_id
    }
  });
  sentenceData = JSON.parse(JSON.stringify(sentenceData));

  wordData.wordbook_id = bookData.id;
  wordData.date = bookData.date;
  wordData.text = sentenceData.text;

  res.send(wordData);
});

module.exports = router;
