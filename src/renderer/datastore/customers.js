import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import utils from '../utils/utils'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

const customers = {
  resultCodes: {
    SUCCESS_CODE: 0 // 성공 응답
  },
  model: {
    // 이름
    name: String,
    // 연락처
    contact: String,
    // 주소1
    address1: String,
    // 주소2
    address2: String,
    // 주소3
    address3: String,
    // 행사알림
    isEventAlarm: Boolean,
    // 설명
    description: String,
    // 생성일
    createDate: Date
  },
  dbo: dbFactory('customers.db'),
  getDocument (doc) {
    return {
      name: doc.name,
      contact: utils.encryptAES256(doc.contact),
      address1: doc.address1,
      address2: doc.address2,
      address3: doc.address3,
      isEventAlarm: doc.isEventAlarm,
      description: doc.description,
      createDate: new Date()
    }
  },
  valid (doc) {
    console.log(doc)
  },
  async insert (doc) {
    return new Promise((resolve) => {
      this.dbo.insert(doc, (err, newDoc) => {
        if (err) {
          resolve({
            isSuccess: false,
            result: err
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
    return new Promise((resolve) => {
      this.dbo.remove({ _id: id }, {}, (err, numRemoved) => {
        if (err) {
          resolve({
            isSuccess: false,
            result: err
          })
        }

        resolve({
          isSuccess: true,
          result: numRemoved
        })
      })
    })
  },
  async update (id, doc) {
    return new Promise((resolve) => {
      this.dbo.update({ _id: id }, { $set: doc }, {}, (err, numUpdated) => {
        if (err) {
          resolve({
            isSuccess: false,
            result: err
          })
        }

        resolve({
          isSuccess: true,
          result: numUpdated
        })
      })
    })
  },
  query: function (doc) {
    let query = {}

    for (let key in doc) {
      if (typeof (doc[key]) === 'string' && doc[key]) {
        query[key] = new RegExp(doc[key])
      } else if (typeof (doc[key]) === 'boolean' && doc[key] !== '') {
        query[key] = doc[key]
      }
    }

    return query
  },
  find: async function (search, sort, list) {
    return new Promise(async (resolve) => {
      let query = this.query(search)
      let totalCnt = await this.count(query)
      list.totalPages = Math.ceil(totalCnt / list.perPage)

      this.dbo.find(query)
        .sort(sort)
        .skip((list.currentPage - 1) * list.perPage)
        .limit(list.perPage)
        .exec((err, docs) => {
          if (err) {
            resolve({
              isSuccess: false,
              result: '조회 실패!'
            })
          }

          docs.forEach((value, index) => {
            value.contact = utils.decryptAES256(value.contact)
          })

          list.rows = docs

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

export default customers
