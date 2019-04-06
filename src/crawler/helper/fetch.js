const http = require('http');
const https = require('https');

async function retrieveS(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = '';
        res
          .on('error', e => {
            reject(e);
          })
          .on('data', chunk => {
            data += chunk;
          })
          .on('end', () => {
            resolve(data);
          });
      })
      .on('error', e => {
        reject(e);
      });
  });
}

async function retrieve(url) {
  return new Promise((resolve, reject) => {
    http
      .get(url, res => {
        let data = '';
        res
          .on('error', e => {
            reject(e);
          })
          .on('data', chunk => {
            data += chunk;
          })
          .on('end', () => {
            resolve(data);
          });
      })
      .on('error', e => {
        reject(e);
      });
  });
}

module.exports = {
  retrieveS,
  retrieve
};
