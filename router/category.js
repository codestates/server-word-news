const express = require('express');
const db = require('../models/index');
const router = express.Router();

router.get('/', function(req, res) {
  //카테고리 목록을 응답한다
  db.Category.findAll()
    .then(result => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.sendStatus(204);
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(500);
    });
});

let categoryId;
router.post('/', function(req, res) {
  //선택된 카테고리id를 저장하고 'Success'라는 문자열을 응답한다.
  //console.log(req.cookies);
  categoryId = req.body.categoryId;
  res
    .cookie('categoryId', categoryId)
    .send(categoryId)
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

module.exports = router;
