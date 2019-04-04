const express = require('express');
const db = require('../models/index');
const router = express.Router();

router.get('/', function(req, res) {
  //카테고리 목록을 응답한다
  db.Category.findAll().then(result => {
    if (result) {
      res.status(200).json(result);
    } else {
      res.sendStatus(204);
    }
  });
});

let category_id;
router.post('/', function(req, res) {
  //선택된 카테고리id를 저장하고 'Success'라는 문자열을 응답한다.
  category_id = req.body.category_id;
  res.cookie('category', category_id).send('cookie : ' + category_id);
});

module.exports = router;
