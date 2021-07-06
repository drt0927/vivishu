import NedbHelper from './nedbHelper2'
// import utils from '../utils/utils'

class Account extends NedbHelper {
  constructor () {
    super('accounts2.db')
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
