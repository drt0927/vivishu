import crypto from 'crypto'

export default {
  getElement (vm, ref) {
    return vm.$refs[ref].$el.getElementsByTagName('input')[0]
  },

  // #region  " 암호화 "
  encryptAES256 (payload) {
    if (!payload) {
      return ''
    }
    const key = 'TnguddlrkWkddldi1#2@3!'
    const cipher = crypto.createCipher('aes-256-cbc', key)
    let result = cipher.update(payload, 'utf8', 'base64')
    result += cipher.final('base64')
    return result
  },
  decryptAES256 (payload) {
    if (!payload) {
      return ''
    }
    const key = 'TnguddlrkWkddldi1#2@3!'
    const decipher = this.crypto.createDecipher('aes-256-cbc', key)
    let result = decipher.update(payload, 'base64', 'utf8')
    result += decipher.final('utf8')
    return result
  },
  encryptSHA512 (payload) {
    const salt = 'rnldudnsTnguddl)3(2*1'
    return crypto.pbkdf2Sync(payload, salt, 100000, 64, 'sha512').toString('base64')
  },
  // #endregion

  // #region " 구조 정의 "
  getCustomerModel () {
    // 고객 정보
    return {
      // 이름
      name: String,
      // 연락처
      contact: String,
      // 주소1
      address1: String,
      // 주소2
      address2: String,
      // 주소3
      address3: String,
      // 행사알림
      isEventAlarm: Boolean,
      // 설명
      description: String,
      // 생성일
      createDate: Date
    }
  },
  getOrderModel () {
    // 주문 정보
    return {
      // 고객 키값 (customer._id)
      customer: String,
      // 주소
      address: String,
      // 구분 [ 1 - 매장 | 2 - 네이버 | 3 - 롯데 ]
      type: Number,
      // 배송완료일
      deliveryCompletedDate: Date,
      // 출고일
      releaseDate: Date,
      // 송장번호
      deliveryNo: String,
      // 배송업체 [ 0 - 기타 | 1 - 롯데 | 2 - 로젠 ]
      deliveryCompany: Number,
      // 설명
      description: String,
      // 제품 정보 (배열)
      products: Array,
      // 생성일
      createDate: Date
    }
  },
  getTradeModel () {
    // 수평이동 정보
    return {
      // 매장 정보 (store._id)
      store: String,
      // 수평이동날짜 (거래일)
      tradeDate: Date,
      // 구분 [ 1 - 입고 | 2 - 출고 ]
      type: Number,
      // 제품 정보 (배열)
      products: Array,
      // 생성일
      createDate: Date
    }
  },
  getStoreModel () {
    // 매장 정보
    return {
      // 이름
      name: String,
      // 연락처
      contact: String,
      // 배송코드
      deliveryCode: String,
      // 매니저
      owner: String,
      // 설명
      description: String,
      // 생성일
      createDate: Date
    }
  },
  getProductModel () {
    // 상품 정보 (order, trade 하위에서만 사용됨)
    return {
      // 제품 번호
      no: String,
      // 수량
      amount: Number,
      // 확정여부
      isConfirm: Boolean,
      // 설명
      description: String
    }
  },
  getScheduleModel () {
    // 일정 정보
    return {
      // 제목
      title: String,
      // 시작일
      startDate: Date,
      // 종료일
      endDate: Date,
      // 종일 여부
      isAllDay: Boolean,
      // 배경색
      backgroundColor: String,
      // 글자색
      fontColor: String,
      // 생성일
      createDate: Date
    }
  },
  getTodoModel () {
    // 할 일 정보
    return {
      // 생성일
      createDate: Date,
      // 내용
      contents: String,
      // 완료여부
      isCompleted: Boolean,
      // 배경색
      backgroundColor: String,
      // 글자색
      fontColor: String
    }
  },
  // #endregion

  // #region " DB Wrapper "
  read (db, query, callback) {
    db.find(query, (err, docs) => {
      callback(err, docs)
    })
  },
  insert (db, doc, callback) {
    db.insert(doc, (err, newDocs) => {
      callback(err, newDocs)
    })
  }
  // #endregion
}
