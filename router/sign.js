const express = require('express');
const crypto = require('crypto');
const db = require('../models/index');
const jwt = require('jsonwebtoken');
const secretObj = require('../config/jwt');

const router = express.Router();

router.post('/signup', function(req, res) {
  const data = req.body;
  console.log(data.user_name);
  db.User.create({
    user_name: data.user_name,
    password: crypto
      .createHmac('sha512', 'saltkey') // hash 알고리즘 및 salt 설정
      .update(data.password) // hashing 할 데이터
      .digest('base64'),
    email: data.email,
    target_lang: data.target_lang,
    use_lang: data.use_lang,
    level: parseInt(data.level),
    category_id: parseInt(data.categoryId)
  })
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
  // 회원가입 정보를 저장하고 'Success'라는 문자열을 응답한다.
});

router.post('/signin', function(req, res) {
  let userPassword = crypto
    .createHmac('sha512', 'saltkey') // hash 알고리즘 및 salt 설정
    .update(req.body.password) // hashing 할 데이터
    .digest('base64');

  //default : hmac sha256
  let token = jwt.sign(
    {
      id: req.body.id
    },
    secretObj.secret,
    { expiresIn: '1000m' } // 이따 다시 수정해라
  );

  db.User.findOne({
    where: {
      user_name: req.body.id
    }
  })
    .then(user => {
      // console.log(user);
      if (user.password === userPassword) {
        res.cookie('user', token);
        res.json({
          token: token
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
  //비밀번호 틀릴 시 처리 하기
  // 로그인 정보를 확인하여 'Success'라는 문자열을 응답한다.
  //res.send('Success');
});

module.exports = router;
