import NedbHelper from './nedbHelper'

class Trade extends NedbHelper {
  constructor () {
    super('trades.db')
  }

  getDocument (defaultObject) {
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
}

export default (new Trade())
