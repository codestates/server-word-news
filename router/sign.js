const express = require('express');
const crypto = require('crypto');
const { User } = require('../models/index');

const router = express.Router();
router.post('/signup', function(req, res) {
  const data = req.body;
  User.create({
    user_name: user_name,
    password: crypto
      .createHmac('sha512', app.get('crypto-secret')) // hash 알고리즘 및 salt 설정
      .update(data.password) // hashing 할 데이터
      .digest('base64'), // 반환 값의 인코딩 방식
    email: data.email,
    target_lang: target_lang,
    user_lang: user_lang,
    level: level,
    categort_id: categort_id
  });
  // 회원가입 정보를 저장하고 'Success'라는 문자열을 응답한다.
  res.send('post sign up');
});

router.post('/signin', function(req, res) {
  // 로그인 정보를 확인하여 'Success'라는 문자열을 응답한다.
  res.send('post sign in');
});

module.exports = router;
