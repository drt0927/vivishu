import NedbHelper from './nedbHelper'

class Customer extends NedbHelper {
  constructor () {
    super('customers.db', ['contact'])
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      name: '',
      contact: '',
      address: '',
      isEventAlarm: false,
      description: ''
    }, defaultObject)
  }
}

export default (new Customer())
