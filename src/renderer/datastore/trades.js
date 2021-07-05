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

class Trade extends NedbHelper {
  constructor () {
    super(dbFactory('trades.db'))

    this.doc = this.getNewDocument()
  }

  getNewDocument (defaultObject) {
    return Object.assign({}, {
      storeId: '',
      name: '',
      type: 1, // [ 1 - 입고 | 2 - 출고 ]
      tradeDate: new Date(),
      no: '',
      amount: 0,
      isConfirm: false
    }, defaultObject)
  }

  validAdd (vm, docs) {
    let result = true

    if (docs.length < 1) {
      alert(`[상품]을 1개 이상 필수 입력 입니다.`)
      return false
    }

    for (let doc of docs) {
      if (!this.validOne(vm, doc)) {
        result = false
        break
      }
    }

    return result
  }

  validOne (vm, doc) {
    if (!doc.storeId) {
      alert(`[지점]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'name').focus()
      return false
    }

    if (!doc.no) {
      alert(`[품번]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'no').focus()
      return false
    }

    if (!doc.amount) {
      alert(`[수량]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'amount').focus()
      return false
    }

    return true
  }
}

export default (new Trade())
