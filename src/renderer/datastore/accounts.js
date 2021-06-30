import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import NedbHelper from './nedbHelper'
import utils from '../utils/utils'
import enums from '../utils/enums'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

class Account extends NedbHelper {
  constructor () {
    super(dbFactory('accounts.db'),
      [
        { key: 'pwd', type: enums.EncryptType.SHA }
      ],
      [
        'pwdConfirm'
      ])

    this.doc = this.getNewDocument()
  }

  getNewDocument (defaultObject) {
    return Object.assign({
      id: '',
      pwd: '',
      pwdConfirm: '',
      role: 0,
      name: '',
      createDate: new Date()
    }, defaultObject)
  }

  validJoin (vm, doc) {
    if (!doc.id) {
      alert(`[아이디]은(는) 필수 값 입니다.`)
      utils.getElement(vm, 'id').focus()
      return false
    }

    if (!doc.pwd) {
      alert(`[비밀번호]은(는) 필수 값 입니다.`)
      utils.getElement(vm, 'pwd').focus()
      return false
    }

    if (!doc.pwdConfirm) {
      alert(`[비밀번호 확인]은(는) 필수 값 입니다.`)
      utils.getElement(vm, 'pwdConfirm').focus()
      return false
    }

    if (doc.pwd !== doc.pwdConfirm) {
      alert(`비밀번호가 일치하지 않습니다`)
      return false
    }

    return true
  }

  validLogin (vm, doc) {
    if (!doc.id) {
      alert(`[아이디]은(는) 필수 값 입니다.`)
      utils.getElement(vm, 'id').focus()
      return false
    }

    if (!doc.pwd) {
      alert(`[비밀번호]은(는) 필수 값 입니다.`)
      utils.getElement(vm, 'pwd').focus()
      return false
    }

    return true
  }
}

export default (new Account())
