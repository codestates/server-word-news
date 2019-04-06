const express = require('express');
const router = express.Router();
const db = require('../models/index');

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

  let bookData = await db.Book.findOne({
    where: {
      date: req.params.date
    }
  });

  res.send('get word date : ' + req.params.date);
});

router.post('/', function(req, res) {
  // 선택된 단어의 complete상태를 true로 저장하고 단어의 id를 응답한다.
  res.send('post words');
});

router.get('/:wordbook_id', function(req, res) {
  // 단어장에서 선택한 단어의 뜻과 예문을 응답한다.
  res.send('get words wordbook id : ' + req.params.wordbook_id);
});

module.exports = router;
