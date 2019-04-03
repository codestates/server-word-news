<<<<<<< HEAD
const password = require('../password.js');

var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'wordnews-database.cbahr4yobiec.us-east-1.rds.amazonaws.com',
  user: 'hee3',
  password: `${password}`,
  database: 'wordnews_database',
  port: 3306
});
=======
const express = require('express');
const category = require('../router/category');
const news = require('../router/news');
const sign = require('../router/sign');
const words = require('../router/words');
const test = require('../router/test');
const setting = require('../router/setting');
>>>>>>> 65590fd70e8f1bb23ff9b1fcc8aabf36307f4503

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');

<<<<<<< HEAD
var port = 3000;
var ip = '0.0.0.0';

function getUser() {
  return new Promise((resolve, reject) => {
    var sql = 'select * from User';

    connection.query(sql, function(err, result) {
      if (err) reject(err);
      resolve(result);
    });
  });
}

var server = http.createServer(function(req, res) {
  var headers = defaultCorsHeaders;
  var statusCode = 200;

  if (req.method === 'GET') {
    if (req.url === '/') {
      console.log('get');
      getUser()
        .then(result => {
          console.log('getUser');
          res.writeHead(200, headers);
          res.end(JSON.stringify(result));
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
=======
//const mysql = require('mysql');
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

// var connection = mysql.createConnection({
//   host     : 'wordnews-database.cbahr4yobiec.us-east-1.rds.amazonaws.com',
//   user     : 'hee3',
//   password : '',
//   database : 'wordnews_database',
//   port : 3306
// });
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
  console.log(req.cookies.category);
  console.log('index page');
  //res.setHeader('content-type', 'application/json');
  db.Article.findAll().then(result => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.sendStatus(204);
    }
  });
>>>>>>> 65590fd70e8f1bb23ff9b1fcc8aabf36307f4503
});

app.use('/api/category', category);

<<<<<<< HEAD
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
=======
app.use('/api/news', news);

app.use('/api/sign', sign);

app.use('/api/words', words);

app.use('/api/test', test);

app.use('/api/setting', setting);

app.listen(port, ip, function() {
  console.log('Listening on http://' + ip + ':' + port);
});

// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10 // Seconds.
// };
>>>>>>> 65590fd70e8f1bb23ff9b1fcc8aabf36307f4503
