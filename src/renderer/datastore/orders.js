import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import NedbHelper from './nedbHelper'
import utils from '../utils/utils'
// import enums from '../utils/enums'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

class Order extends NedbHelper {
  constructor () {
    super(dbFactory('orders.db'))

    this.doc = this.getNewDocument()
  }

  getNewDocument (defaultObject) {
    return Object.assign({}, {
      customerId: '',
      name: '',
      address: '',
      type: 0, // [ 1 - 매장 | 2 - 네이버 | 3 - 롯데 ]
      deliveryCompletedDate: null,
      releaseDate: new Date(),
      deliveryNo: '',
      deliveryCompany: 0, // [ 0 - 기타 | 1 - 롯데 | 2 - 로젠 ]
      description: '',
      products: []
    }, defaultObject)
  }

  getProductDocument (product) {
    return Object.assign({
      no: '',
      amount: 0,
      isConfirm: false,
      description: ''
    }, product)
  }

  valid (vm, doc) {
    // 주문자, 주소, 품번만 필수 값

    if (!doc.customerId) {
      alert(`[주문자]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'name').focus()
      return false
    }

    if (!doc.address) {
      alert(`[주소]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'address').focus()
      return false
    }

    if (doc.products.length < 1) {
      alert(`[상품]은(는) 필수 값 입니다.\r\n1개 이상의 상품을 등록해 주세요.`)
      // utils.common.getElement(vm, 'address').focus()
      return false
    }

    // if (!utils.check.call(doc.contact)) {
    //   alert('[연락처] 형식이 올바르지 않습니다. 숫자 10~11자리 입니다.')
    //   utils.common.getElement(vm, 'contact').focus()
    //   return false
    // }

    return true
  }
}

export default (new Order())
