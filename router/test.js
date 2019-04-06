const express = require('express');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');
const db = require('../models/index');

const router = express.Router();

router.get('/:date', function(req, res) {
  let token = req.cookies.user;

  let decoded = jwt.verify(token, secretObj.secret);
  //console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', decoded);
  if (decoded) {
    if (req.params.date) {
      //날짜값이 있을 때 날짜에 해당하는 단어만 보여줌
    } else {
      //날짜값이 없을 때 모두 보여줌
    }
    res.send(' 권한 있다');
  } else {
    res.status(500).send('로그인 하세요');
  }
  // date에 맞는 test할 단어와 선지 목록을 응답한다.
  //res.send('get test date : ' + req.params.date);
});

module.exports = router;
