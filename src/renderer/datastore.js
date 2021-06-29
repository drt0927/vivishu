import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

const dbFactory = file =>
  new Datastore({
    filename: `${path.join(remote.app.getPath('userData'))}/data/${file}`,
    autoload: true
  })

const db = {
  accounts: dbFactory('accounts.db'),
  customers: dbFactory('customers.db'),
  orders: dbFactory('orders.db'),
  trades: dbFactory('trades.db'),
  stores: dbFactory('stores.db'),
  schedules: dbFactory('schedules.db'),
  todos: dbFactory('todos.db')
}

export default db
