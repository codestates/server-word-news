function getGrade(ngram) {
  let grade = 5;
  if (0.0000009 < ngram && ngram <= 0.000007) {
    grade = 4;
  } else if (0.000007 < ngram && ngram <= 0.00002) {
    grade = 3;
  } else if (0.00002 < ngram && ngram <= 0.0001) {
    grade = 2;
  } else if (0.0001 < ngram) {
    grade = 1;
  }
  return grade;
}

module.exports = getGrade;
