const EncryptType = {
  AES: 1,
  SHA: 2
}

const NedbQueryOperators = {
  // <
  LessThan: '$lt',
  // <=
  LessThanEqual: '$lte',
  // >
  GraterThan: '$gt',
  // >=
  GraterThanEqual: '$gte',
  // 포함 하는것
  In: '$in',
  // 포함하지 않는것
  NotIn: '$nin',
  // 같지 않은것
  NotEqual: '$ne',
  // 같은것
  Equal: '$e',
  // 해당 컬럼이 있는지 여부
  Exists: '$exists',
  // 정규식
  Regex: '$regex',
  // #region " logical operator "
  Or: '$or',
  And: '$and',
  Not: '$not',
  // 함수 조건
  Where: '$where'
  // #endregion
}

export default {
  EncryptType,
  NedbQueryOperators
}
