const express = require('express');
const crypto = require('crypto');
const db = require('../models/index');

const router = express.Router();
//const app = express();

//app.set('crypto-secret', 'saltkey');

router.post('/signup', function(req, res) {
  const data = req.body;
  console.log(data.user_name);
  db.User.create({
    user_name: data.user_name,
    password: data.password,
    email: data.email,
    target_lang: data.target_lang,
    use_lang: data.use_lang,
    level: data.level,
    category_id: data.category_id
  })
    .then(result => {
      res.status(200).send('Sucess');
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
  // 회원가입 정보를 저장하고 'Success'라는 문자열을 응답한다.
});

router.post('/signin', function(req, res) {
  // 로그인 정보를 확인하여 'Success'라는 문자열을 응답한다.
  res.send('post sign in');
});

module.exports = router;
