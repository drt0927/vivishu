import NedbHelper from './nedbHelper'

class Schedule extends NedbHelper {
  constructor () {
    super('schedules.db')
  }

  getDocument (defaultObject) {
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
}

export default (new Schedule())
