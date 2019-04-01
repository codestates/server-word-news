const express = require('express');
const router = express.Router();

router.get('/:date', function(req, res) {
  // date에 맞는 test할 단어와 선지 목록을 응답한다.
  res.send('get test date : ' + req.params.date);
});

module.exports = router;
