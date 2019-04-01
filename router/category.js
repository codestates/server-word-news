const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  //카테고리 목록을 응답한다
  res.send('get category ');
});

router.post('/', function(req, res) {
  //선택된 카테고리id를 저장하고 'Success'라는 문자열을 응답한다.
  res.send('post categoty');
});

module.exports = router;
