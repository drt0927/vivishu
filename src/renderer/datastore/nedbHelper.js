'use strict'

import utils from '../utils/utils'
import enums from '../utils/enums'

export default class NedbHelper {
  constructor (db, encryptFields, ignoreFields) {
    this.db = db
    this.encryptFields = encryptFields || []
    this.ignoreFields = ignoreFields || []
  }

  getDocument (doc) {
    let newDoc = Object.assign({}, this.doc, doc)

    // 암호화 필드
    this.encryptFields.forEach(field => {
      if (field.type === enums.EncryptType.AES && doc[field.key] !== undefined) {
        newDoc[field.key] = utils.crypt.encryptAES256(newDoc[field.key])
      } else if (field.type === enums.EncryptType.SHA && doc[field.key] !== undefined) {
        newDoc[field.key] = utils.crypt.encryptSHA512(newDoc[field.key])
      }
    })
    if (!newDoc.createDate) {
      newDoc.createDate = new Date()
    }

    // 저장하면 안되는 필드 제거
    this.ignoreFields.forEach(field => {
      if (newDoc[field] !== undefined) {
        delete newDoc[field]
      }
    })

    return newDoc
  }

  query (doc) {
    let query = {}

    // 암호화 필드
    this.encryptFields.forEach(field => {
      if (field.type === enums.EncryptType.AES && doc[field.key] !== undefined) {
        doc[field.key] = utils.crypt.encryptAES256(doc[field.key])
      } else if (field.type === enums.EncryptType.SHA && doc[field.key] !== undefined) {
        doc[field.key] = utils.crypt.encryptSHA512(doc[field.key])
      }
    })

    for (let key in doc) {
      if (typeof (doc[key]) === 'string' && doc[key]) {
        query[key] = new RegExp(doc[key])
      } else if (typeof (doc[key]) === 'boolean' && doc[key] !== '') {
        query[key] = doc[key]
      } else if (typeof (doc[key]) === 'number' && doc[key] !== '') {
        query[key] = doc[key]
      }
    }

    return query
  }

  async insert (doc) {
    return new Promise((resolve) => {
      let newDoc = this.getDocument(doc)
      if (newDoc === undefined) {
        return
      }

      this.db.insert(newDoc, (err, newDoc) => {
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
  }

  async remove (id) {
    return new Promise((resolve) => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
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
  }

  async update (id, doc) {
    return new Promise((resolve) => {
      let newDoc = this.getDocument(doc)
      if (newDoc === undefined) {
        return
      }

      this.db.update({ _id: id }, { $set: newDoc }, {}, (err, numUpdated) => {
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
  }

  async findOne (search) {
    return new Promise((resolve) => {
      let helper = this
      let query = this.query(Object.assign({}, search))
      this.db.find(query)
        .limit(1)
        .exec((err, docs) => {
          if (err) {
            resolve({
              isSuccess: false,
              result: '조회 실패!'
            })
          }

          if (docs.length < 1) {
            resolve({
              isSuccess: false,
              result: '조회 실패!'
            })
          }

          docs.forEach(value => {
            helper.encryptFields.forEach(field => {
              if (field.type === enums.EncryptType.AES && value[field.key] !== undefined) {
                value[field.key] = utils.crypt.decryptAES256(value[field.key])
              }
            })
          })

          resolve({
            isSuccess: true,
            result: docs
          })
        })
    })
  }

  async find (search, sort, list) {
    return new Promise(async (resolve) => {
      let helper = this

      let query = this.query(Object.assign({}, search))
      let totalCnt = await this.count(Object.assign({}, search))
      list.totalPages = Math.ceil(totalCnt / list.perPage)

      this.db.find(query)
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

          docs.forEach(value => {
            helper.encryptFields.forEach(field => {
              if (field.type === enums.EncryptType.AES && value[field.key] !== undefined) {
                value[field.key] = utils.crypt.decryptAES256(value[field.key])
              }
            })
          })

          list.rows = docs

          resolve({
            isSuccess: true,
            result: docs
          })
        })
    })
  }

  async count (search) {
    return new Promise((resolve) => {
      let query = this.query(search || {})

      this.db.count(query, (err, cnt) => {
        if (err) {
          resolve(0)
        }

        resolve(cnt)
      })
    })
  }
}
