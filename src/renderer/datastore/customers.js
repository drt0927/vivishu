import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

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
  getDocument (model) {
    return {
      name: model.name,
      contact: model.contact,
      address1: model.address1,
      address2: model.address2,
      address3: model.address3,
      isEventAlarm: model.isEventAlarm,
      description: model.description,
      createDate: new Date()
    }
  },
  valid (model) {
    console.log(model)
  },
  async insert (doc) {
    return new Promise((resolve, reject) => {
      this.dbo.find(doc, (err, newDoc) => {
        if (err) {
          reject(err)
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
  find: async function () {

  },
  count: async function () {
    // dbo.count()
  }
}

export default customers
