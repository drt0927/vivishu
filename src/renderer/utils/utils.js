import crypto from 'crypto'
import enums from './enums'

const common = {
  getElement (vm, ref) {
    return vm.$refs[ref].$el.getElementsByTagName('input')[0]
  }
}

const masking = {
  checkNull (str) {
    if (typeof str === 'undefined' || str === null || str === '') {
      return true
    } else {
      return false
    }
  },
  phone (str) {
    let originStr = str
    let phoneStr
    let maskingStr
    if (this.checkNull(originStr) === true) {
      return originStr
    }

    if (originStr.toString().split('-').length !== 3) {
      // 1) -가 없는 경우
      phoneStr = originStr.length < 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi)
      if (this.checkNull(phoneStr) === true) {
        return originStr
      }

      if (originStr.length < 11) {
        // 1.1) 0110000000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3'))
      } else {
        // 1.2) 01000000000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3'))
      }
    } else {
      // 2) -가 있는 경우
      phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi)
      if (this.checkNull(phoneStr) === true) {
        return originStr
      }

      if (/-[0-9]{3}-/.test(phoneStr)) {
        // 2.1) 00-000-0000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, '-***-'))
      } else if (/-[0-9]{4}-/.test(phoneStr)) {
        // 2.2) 00-0000-0000
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, '-****-'))
      }
    }
    return maskingStr
  }
}

const check = {
  phone (str) {
    var regExp = /(01[0|1|6|9|7])(\d{3}|\d{4})(\d{4}$)/g
    var result = regExp.exec(str)
    if (!result) {
      return false
    }
    return true
  },
  call (str) {
    var regExp = /(\d{2}|\d{3})(\d{3}|\d{4})(\d{4}$)/g
    var result = regExp.exec(str)
    if (!result) {
      return false
    }
    return true
  }
}

const crypt = {
  encryptAES256 (payload) {
    try {
      if (!payload) {
        return ''
      }
      const key = 'TnguddlrkWkddldi1#2@3!'
      const cipher = crypto.createCipher('aes-256-cbc', key)
      let result = cipher.update(payload, 'utf8', 'base64')
      result += cipher.final('base64')
      return result
    } catch (ex) {
      console.log(ex)
      return ''
    }
  },
  decryptAES256 (payload) {
    try {
      if (!payload) {
        return ''
      }
      const key = 'TnguddlrkWkddldi1#2@3!'
      const decipher = crypto.createDecipher('aes-256-cbc', key)
      let result = decipher.update(payload, 'base64', 'utf8')
      result += decipher.final('utf8')
      return result
    } catch (ex) {
      console.log(ex)
      return ''
    }
  },
  encryptSHA512 (payload) {
    try {
      const salt = 'rnldudnsTnguddl)3(2*1'
      return crypto.pbkdf2Sync(payload, salt, 100000, 64, 'sha512').toString('base64')
    } catch (ex) {
      console.log(ex)
      return ''
    }
  }
}

const structures = {
  // #region " 구조 정의 "
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
  roductModel () {
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
  }
  // #endregion
}

export default {
  common,
  masking,
  check,
  crypt,
  structures,
  enums
}
