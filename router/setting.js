const express = require('express');
const router = express.Router();

router.put('/setting', function(req, res) {
  // 설정 값들을 저장하고, 'Success'라는 문자열을 응답한다.
  res.send('put setting');
});

module.exports = router;
