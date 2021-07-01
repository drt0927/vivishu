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

class Store extends NedbHelper {
  constructor () {
    super(dbFactory('stores.db'))

    this.doc = this.getNewDocument()
  }

  getNewDocument (defaultObject) {
    return Object.assign({
      name: '',
      contact: '',
      deliveryCode: '',
      owner: '',
      description: ''
    }, defaultObject)
  }

  valid (vm, doc) {
    if (!doc.name) {
      alert(`[지점명]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'name').focus()
      return false
    }

    if (!utils.check.call(doc.contact)) {
      alert('[연락처] 형식이 올바르지 않습니다. 숫자 10~11자리 입니다.')
      utils.common.getElement(vm, 'contact').focus()
      return false
    }

    return true
  }
}

export default (new Store())
