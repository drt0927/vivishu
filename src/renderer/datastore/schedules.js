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

class Schedule extends NedbHelper {
  constructor () {
    super(dbFactory('schedules.db'))

    this.doc = this.getNewDocument()
  }

  getNewDocument (defaultObject) {
    return Object.assign({}, {
      id: new Date().getTime(),
      startDate: new Date(),
      endDate: new Date(),
      title: '',
      contents: '',
      classes: '',
      style: ''
    }, defaultObject)
  }

  valid (vm, doc) {
    if (!doc.title) {
      alert(`[제목]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'title').focus()
      return false
    }

    if (!doc.startDate) {
      alert(`[시작일]은(는) 필수 값 입니다.`)
      utils.common.getElement(vm, 'startDate').focus()
      return false
    }

    if (!doc.endDate) {
      doc.endDate = doc.startDate
    }

    return true
  }
}

export default (new Schedule())
