const express = require('express');
const category = require('../router/category');
const news = require('../router/news');
const sign = require('../router/sign');
const words = require('../router/words');
const test = require('../router/test');
const setting = require('../router/setting');
const db = require('../models/index');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const mysql = require('mysql');

var app = express();
var ip = '0.0.0.0';
var port = 3000;
var headers = defaultCorsHeaders;

//넘어오는 cookie 데이터를 JSON객체로 변환해주는 라이브러리
app.use(cookieParser());

//body로 넘어오는 데이터를 JSON 객체로 변환해주는 라이브러리
//app.use(bodyParser.JSON());

// bodyParser.urlencoded({ extended }) - 중첩 객체를 허용할지 말지를 결정하는 옵션
// 참고 링크(https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436)
app.use(bodyParser.urlencoded({ extended: false }));

function getUser() {
  return new Promise((resolve, reject) => {
    var sql = 'select * from User';

    connection.query(sql, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

app.get('/', function(req, res) {
  console.log('index page');
  res.send('hello word news');
});

app.use('/category', category);

app.use('/news', news);

//signin과 signup을 하나으 라우터로 묶기 위해 endpoint를 /sign/signup .. 으로 변경
app.use('/sign', sign);

app.use('/words', words);

app.use('/test', test);

app.use('/setting', setting);

app.listen(port, ip, function() {
  console.log('Listening on http://' + ip + ':' + port);
});

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
