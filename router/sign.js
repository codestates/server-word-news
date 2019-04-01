const express = require('express');
const router = express.Router();

router.post('/signup', function(req, res) {
  // 회원가입 정보를 저장하고 'Success'라는 문자열을 응답한다.
  res.send('post sign up');
});

router.post('/signin', function(req, res) {
  // 로그인 정보를 확인하여 'Success'라는 문자열을 응답한다.
  res.send('post sign in');
});

module.exports = router;
