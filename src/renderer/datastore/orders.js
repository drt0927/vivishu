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
      type: 1, // [ 1 - 매장 | 2 - 네이버 | 3 - 롯데 ]
      deliveryCompletedDate: null,
      releaseDate: new Date(),
      deliveryNo: '',
      deliveryCompany: 0, // [ 0 - 기타 | 1 - 롯데 | 2 - 로젠 ]
      description: '',
      products: []
    }, defaultObject)
  }

  getProductDocument (product) {
    return Object.assign({}, {
      _id: 0,
      no: '',
      amount: 0,
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
      if (vm.order.products.length < 1) {
        vm.addProduct()
      } else {
        utils.common.getElement(vm, 'no').focus()
      }

      return false
    }

    return true
  }
}

export default (new Order())
