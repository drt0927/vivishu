import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import utils from '../utils/utils'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

const accounts = {
  resultCodes: {
    SUCCESS_CODE: 0, // 성공 응답
    VALID_EMPTY_PASSWORD: 1,
    VALID_CONFIRM: 2
  },
  model: {
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
  },
  dbo: dbFactory('accounts.db'),
  getDocument (model) {
    return {
      id: model.id,
      pwd: utils.encryptSHA512(model.pwdConfirm),
      role: model.role,
      name: model.name,
      createDate: new Date()
    }
  },
  valid (model) {
    if (!model.pwd || !model.pwdConfirm) {
      return {
        msg: '비밀번호를 입력해 주세요.',
        code: this.resultCodes.VALID_EMPTY_PASSWORD
      }
    }

    if (model.pwd !== model.pwdConfirm) {
      return {
        msg: '비밀번호를 입력해 주세요.',
        code: this.resultCodes.VALID_CONFIRM
      }
    }

    return {
      code: this.resultCodes.SUCCESS_CODE
    }
  },
  async insert (doc) {
    return new Promise((resolve) => {
      this.dbo.insert(doc, (err, newDoc) => {
        if (err) {
          resolve({
            isSuccess: false,
            result: '데이터 생성 실패!'
          })
        }

        resolve({
          isSuccess: true,
          result: newDoc
        })
      })
    })
  },
  async delete (id) {
    return new Promise((resolve, reject) => {
      this.dbo.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
          reject(err)
        }

        resolve({
          isSuccess: true,
          result: numRemoved
        })
      })
    })
  },
  async update (id, doc) {
    return new Promise((resolve, reject) => {
      this.dbo.update({ _id: id }, { $set: doc }, {}, (err, numUpdated) => {
        if (err) {
          reject(err)
        }

        resolve({
          isSuccess: true,
          result: numUpdated
        })
      })
    })
  },
  find: async function (query) {
    return new Promise((resolve) => {
      this.dbo.find(query, (err, docs) => {
        if (err) {
          resolve({
            isSuccess: false,
            result: '조회 실패!'
          })
        }

        resolve({
          isSuccess: true,
          result: docs
        })
      })
    })
  },
  count: async function (query) {
    return new Promise((resolve) => {
      if (!query) {
        query = {}
      }

      this.dbo.count(query, (err, cnt) => {
        if (err) {
          resolve(0)
        }

        resolve(cnt)
      })
    })
  }
}

export default accounts
