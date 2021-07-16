import NedbHelper from './nedbHelper'

class Todo extends NedbHelper {
  constructor () {
    super('todos.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      contents: '',
      isCompleted: false
    }, defaultObject)
  }
}

export default (new Todo())
