'use strict'

import utils from '../utils/utils'
import enums from '../utils/enums'
import cloneDeep from 'lodash.clonedeep'

export default class NedbHelper {
  constructor (db, encryptFields, ignoreFields) {
    this.db = db
    this.encryptFields = encryptFields || []
    this.ignoreFields = ignoreFields || []
  }

  getDocument (doc) {
    let newDoc = this.deepClone(Object.assign({}, this.doc, doc))

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

  getDocuments (docs) {
    let newDocs = []
    for (var doc of docs) {
      newDocs.push(this.getDocument(doc))
    }

    return newDocs
  }

  // 깊은 복사
  deepClone (obj) {
    if (!obj) {
      return {}
    }

    return cloneDeep(obj)
  }

  query (search) {
    let query = {}

    // 암호화 필드
    this.encryptFields.forEach(field => {
      if (field.type === enums.EncryptType.AES && search[field.key] && search[field.key].value) {
        search[field.key].value = utils.crypt.encryptAES256(search[field.key].value)
      } else if (field.type === enums.EncryptType.SHA && search[field.key] && search[field.key].value) {
        search[field.key].value = utils.crypt.encryptSHA512(search[field.key].value)
      }
    })

    for (let fieldKey in search) {
      if (search[fieldKey].value === '' || search[fieldKey].value === undefined || search[fieldKey].value === null) {
        continue
      }

      if (search[fieldKey].operator === enums.NedbQueryOperators.Regex) {
        if (!query[fieldKey]) {
          query[fieldKey] = {}
        }

        query[fieldKey].$regex = new RegExp(search[fieldKey].value)
      } else if (search[fieldKey].operator === enums.NedbQueryOperators.Equal) {
        query[fieldKey] = search[fieldKey].value
      } else if (search[fieldKey].operator === enums.NedbQueryOperators.Where) {
        search[fieldKey].callback(search[fieldKey].value)
        query.$where = search[fieldKey].func
      } else if (search[fieldKey].operator === enums.NedbQueryOperators.GraterThanEqual) {
        if (!query[fieldKey]) {
          query[fieldKey] = {}
        }
        query[fieldKey].$gte = search[fieldKey].value
      } else if (search[fieldKey].operator === enums.NedbQueryOperators.LessThanEqual) {
        if (!query[fieldKey]) {
          query[fieldKey] = {}
        }
        query[fieldKey].$lte = search[fieldKey].value
      }
    }

    return query
  }

  async insertRange (docs) {
    return new Promise(async (resolve) => {
      let newDocs = this.getDocuments(docs)
      if (newDocs.length < 1) {
        return
      }

      for (let doc of newDocs) {
        let result = await this.insert(doc)
        if (!result.isSuccess) {
          resolve({
            isSuccess: false,
            result: result.err
          })
          break
        }
      }

      resolve({
        isSuccess: true
      })
    })
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
      let deepSearch = this.deepClone(search)
      let query = this.query(deepSearch)
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

      let deepSearch = this.deepClone(search)
      let query = this.query(deepSearch)
      let totalCnt = await this.count(deepSearch)
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

          if (!docs) {
            docs = []
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
      let deepSearch = this.deepClone(search)
      let query = this.query(deepSearch)

      this.db.count(query, (err, cnt) => {
        if (err) {
          resolve(0)
        }

        resolve(cnt)
      })
    })
  }
}
