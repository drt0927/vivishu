'use strict'

import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'
import utils from '../utils/utils'
import cloneDeep from 'lodash.clonedeep'

const dbFactory = file => {
  return new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })
}

export default class NedbHelper {
  constructor (dbName, cryptFields) {
    this.db = dbFactory(dbName)
    this.cryptFields = cryptFields || []
  }

  /**
   * 결과 Model 반환
   * @param {Object} err 에러값
   * @param {Object} data 결과데이터
   * @returns result Model
   */
  getResult (err, data) {
    if (err) {
      console.error(err)
    }
    return {
      isSuccess: !err,
      result: data
    }
  }

  /**
   * 암호화 필드 crypt 처리
   * @param {Object} doc doc
   */
  convertEncrypt (doc) {
    for (let f of this.cryptFields) {
      doc[f] = utils.crypt.encryptAES256(doc[f])
    }
  }

  /**
   * 복호화 필드 crypt 처리
   * @param {Object} doc doc
   */
  convertDecrypt (doc) {
    for (let f of this.cryptFields) {
      doc[f] = utils.crypt.decryptAES256(doc[f])
    }
  }

  /**
   * 단일 doc 추가
   * @param {Object} doc Add Object
   * @returns result Model
   */
  async add (doc) {
    return new Promise(resolve => {
      let cryptDoc = cloneDeep(doc)
      if (!cryptDoc.createDate) {
        cryptDoc.createDate = new Date()
      }
      this.convertEncrypt(cryptDoc)
      this.db.insert(cryptDoc, (err, newDoc) => {
        resolve(this.getResult(err, newDoc))
      })
    })
  }

  /**
   * 다중 doc 추가
   * @param {Array} docs Add Objects
   * @returns result Model
   */
  async addRange (docs) {
    return new Promise(resolve => {
      let insertDocs = []

      for (let doc of docs) {
        let insertDoc = cloneDeep(doc)
        if (!insertDoc.createDate) {
          insertDoc.createDate = new Date()
        }
        this.convertEncrypt(insertDoc)
        insertDocs.push(insertDoc)
      }

      this.db.insert(insertDocs, (err, newDocs) => {
        resolve(this.getResult(err, newDocs))
      })
    })
  }

  /**
   * 단일 doc 삭제
   * @param {String} id doc _id
   * @returns result Model
   */
  async remove (id) {
    return new Promise(resolve => {
      this.db.remove({ _id: id }, {}, (err, numRemoved) => {
        resolve(this.getResult(err, numRemoved))
      })
    })
  }

  /**
   * 다중 doc 삭제
   * @param {Object} query 삭제 대상 쿼리
   * @returns result Model
   */
  async removeMulti (query) {
    return new Promise(resolve => {
      if (!query) {
        resolve(this.getResult('삭제 쿼리가 비어있습니다.', 0))
      }
      this.db.remove(query, { multi: true }, (err, numRemoved) => {
        resolve(this.getResult(err, numRemoved))
      })
    })
  }

  /**
   * 단일 doc 업데이트
   * @param {Object} doc 업데이트 대상 doc
   * @returns result Model
   */
  async update (doc) {
    return new Promise(resolve => {
      if (!doc._id) {
        resolve(this.getResult('_id가 없습니다.', 0))
      }
      let cryptDoc = cloneDeep(doc)
      if (!cryptDoc.createDate) {
        cryptDoc.createDate = new Date()
      }
      this.convertEncrypt(cryptDoc)
      this.db.update({ _id: cryptDoc._id }, cryptDoc, {}, (err, numAffected) => {
        resolve(this.getResult(err, numAffected))
      })
    })
  }

  /**
   * 다중 doc 업데이트
   * @param {Object} query 업데이트 대상 쿼리
   * @param {Object} doc 업데이트 대상 doc
   * @returns result Model
   */
  async updateMulti (query, doc) {
    return new Promise(resolve => {
      if (!query) {
        resolve(this.getResult('업데이트 쿼리가 비어있습니다.', 0))
      }
      this.db.update(query, doc, { multi: true }, (err, numAffected, affectedDocuments) => {
        resolve(this.getResult(err, { numAffected: numAffected, affectedDocuments: affectedDocuments }))
      })
    })
  }

  /**
   * 단일 doc 검색
   * @param {String} id 검색 대상 _id
   * @returns result Model
   */
  async findOne (id) {
    return new Promise(resolve => {
      this.db.findOne({ _id: id }, (err, doc) => {
        if (doc) {
          // 복호화
          this.convertDecrypt(doc)
        }

        resolve(this.getResult(err, doc))
      })
    })
  }

  /**
   * 단일 doc 쿼리 검색
   * @param {Object}} query 검색 쿼리
   * @returns result Model
   */
  async findOneByQuery (query) {
    return new Promise(resolve => {
      this.db.findOne(query, (err, doc) => {
        resolve(this.getResult(err, doc))
      })
    })
  }

  /**
   * 다중 doc 검색
   * @param {Object} query 검색 쿼리
   * @param {Object} sort 정렬
   * @param {Number} skip 건너뛰기
   * @param {Number} limit doc 개수
   * @returns result Model
   */
  async find (query, sort, skip, limit) {
    return new Promise(resolve => {
      this.db
        .find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec((err, docs) => {
          resolve(this.getResult(err, docs))
        })
    })
  }

  async findByQuery (query) {
    return new Promise(resolve => {
      this.db
        .find(query)
        .exec((err, docs) => {
          resolve(this.getResult(err, docs))
        })
    })
  }

  /**
   * 테이블 바인딩을 위한 검색
   * @param {Object} table 테이블 조회 Object
   */
  async findForTable (table, codes = []) {
    let query = {}
    if (table.search && table.search.getQuery) {
      query = table.search.getQuery()
      for (var q in query) {
        if (!query[q]) {
          delete query[q]
        }
      }
    }

    let count = await this.count(query)
    let skip = (table.currentPage - 1) * table.perPage
    let find = await this.find(query, table.sort, skip, table.perPage)

    table.totalPages = Math.ceil(count.result / table.perPage)

    // 복호화
    find.result.forEach(value => {
      this.convertDecrypt(value)
    })

    if (codes.length > 0) {
      find.result.forEach((r) => {
        let code = codes.find((e) => Number(e.code) === Number(r.type))
        r.typeName = code.name
        r.typeColor = code.color
      })
    }

    table.rows = find.result
  }

  /**
   * doc의 개수 조회
   * @param {Object} query 개수 조회 쿼리
   * @returns result Model
   */
  async count (query) {
    return new Promise(resolve => {
      this.db.count(query, (err, count) => {
        resolve(this.getResult(err, count))
      })
    })
  }
}
