import NedbHelper from './nedbHelper'

class Account extends NedbHelper {
  constructor () {
    super('accounts.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      id: '',
      pwd: '',
      role: 0,
      name: ''
    }, defaultObject)
  }
}

export default (new Account())
