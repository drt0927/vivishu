import NedbHelper from './nedbHelper2'

class Customer extends NedbHelper {
  constructor () {
    super('customers2.db', ['contact'])
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
