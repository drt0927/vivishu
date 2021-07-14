import NedbHelper from './nedbHelper2'

class Order extends NedbHelper {
  constructor () {
    super('orders2.db')
  }

  getDocument (defaultObject) {
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
}

export default (new Order())
