import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

const db = {
  accounts () {
    const dbo = dbFactory('accounts.db')
    // 계정 정보
    const model = {
      // ID
      id: String,
      // 비밀번호 (암호화 SHA512)
      pwd: String,
      // 비밀번호 확인
      pwdConfirm: String,
      // 권한 (99 - 관리자)
      role: Number,
      // 이름
      name: String,
      // 생성일
      createDate: Date
    }

    return {
      dbo,
      model,
      valid: function (model) {
        if (!model.pwd || !model.pwdConfirm) {
          return {
            msg: '비밀번호를 입력해 주세요.',
            result: false
          }
        }

        if (model.pwd !== model.pwdConfirm) {
          return {
            msg: '비밀번호를 입력해 주세요.',
            result: false
          }
        }

        return {
          result: true
        }
      }
    }
  },
  customers: dbFactory('customers.db'),
  orders: dbFactory('orders.db'),
  trades: dbFactory('trades.db'),
  stores: dbFactory('stores.db'),
  schedules: dbFactory('schedules.db'),
  todos: dbFactory('todos.db')
}

export default db
