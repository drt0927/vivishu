import NedbHelper from './nedbHelper2'

class Store extends NedbHelper {
  constructor () {
    super('stores2.db')
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
