const express = require('express');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');

const router = express.Router();

router.get('/:date', function(req, res) {
  let token = req.cookies.user;

  let decoded = jwt.verify(token, secretObj.secret);
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaa', decoded);
  if (decoded) {
    res.send(' 권한 있다');
  } else {
    res.send(' 권한 없다');
  }
  // date에 맞는 test할 단어와 선지 목록을 응답한다.
  //res.send('get test date : ' + req.params.date);
});

module.exports = router;
