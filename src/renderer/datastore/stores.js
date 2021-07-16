import NedbHelper from './nedbHelper'

class Store extends NedbHelper {
  constructor () {
    super('stores.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      name: '',
      contact: '',
      deliveryCode: '',
      owner: '',
      description: ''
    }, defaultObject)
  }
}

export default (new Store())
