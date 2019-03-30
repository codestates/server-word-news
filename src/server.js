const express = require('express');
const password = require('../password.js');
var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'wordnews-database.cbahr4yobiec.us-east-1.rds.amazonaws.com',
  user: 'hee3',
  password: `${password}`,
  database: 'wordnews_database',
  port: 3306
});

var app = express();
var ip = '0.0.0.0';
var port = 3000;
var headers = defaultCorsHeaders;

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
});

app.get('/user/:id', function(req, res) {
  res.send('received a get request, param : ' + req.params.id);
});

app.listen(port, ip, function() {
  console.log('Listening on http://' + ip + ':' + port);
});

// var http = require('http');

// var port = 3000;
// var ip = '0.0.0.0';

// var server = http.createServer(function(req, res) {
//
//   var statusCode = 200;

//   if (req.method === 'GET') {
//     if (req.url === '/') {
//       console.log('get');
//       getUser()
//         .then(result => {
//           console.log('getUser');
//           res.writeHead(200, headers);
//           res.end(JSON.stringify(result));
//         })
//         .catch(err => {
//           console.log(err);
//         });
//     }
//   }
// });
// eslint-disable-next-line no-console
//console.log('Listening on http://' + ip + ':' + port);
//server.listen(port, ip);

//module.exports = server;

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
