const express = require('express');
const category = require('../router/category');
const news = require('../router/news');
const sign = require('../router/sign');
const words = require('../router/words');
const test = require('../router/test');
const setting = require('../router/setting');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const crypto = require('crypto');

const mysql = require('mysql');
const db = require('../models/index');

var app = express();
var ip = '0.0.0.0';
var port = 3000;
//var headers = defaultCorsHeaders;

/**
 * session(option)
 * secret - session hijacking을 막기위해 hash값에 추가로 들어가는 값 (Salt와 비슷한 개념)
 * resave - session을 언제나 저장할지 정하는 값
 * saveUninitialize: true - 세션이 저장되기 전에 uninitialized 상태로 만들어 저장
 * cookie/ secure - default는 true로 https상에서 통신할 때 정상적으로
 *  */
app.use(
  session({
    secret: '@wordnews',
    resave: false,
    saveUninitialized: true
  })
);

//넘어오는 cookie 데이터를 JSON객체로 변환해주는 라이브러리
app.use(cookieParser());

//body로 넘어오는 데이터를 JSON 객체로 변환해주는 라이브러리
app.use(bodyParser.json());

// bodyParser.urlencoded({ extended }) - 중첩 객체를 허용할지 말지를 결정하는 옵션
// 참고 링크(https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436)
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * cors() - CORS를 대응하기 위한 라이브러리 ( Access-Control-Allow-Origin: * )
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
app.use(cors());

/**
 * 비밀번호 hash에 추가로 넣을 salt카를 설정 express 자체에 세팅 app.set(key, value)
 */
app.set('crypto-secret', 'saltkey');

// function getUser() {
//   return new Promise((resolve, reject) => {
//     var sql = 'select * from User';

//     connection.query(sql, function(err, result) {
//       if (err) reject(err);
//       resolve(result);
//     });
//   });
// }

app.get('/', function(req, res) {
  console.log('index page');
  db.Article.findAll().then(result => {
    if (result) {
      res.status(200).send(JSON(result));
    }
  });
});

app.use('/category', category);

app.use('/news', news);

//signin과 signup을 하나의 라우터로 묶기 위해 endpoint를 /sign/signup .. 으로 변경
app.use('/sign', sign);

app.use('/words', words);

app.use('/test', test);

app.use('/setting', setting);

app.listen(port, ip, function() {
  console.log('Listening on http://' + ip + ':' + port);
});

// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };
