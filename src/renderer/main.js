import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

import db from './datastore/index'
import FilbertUtils from './plugin/utils'

import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import VueSweetalert2 from 'vue-sweetalert2'
import VCalendar from 'v-calendar'
import moment from 'moment'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.config.performance = true

Vue.prototype.$db = db
moment.locale('ko')
Vue.prototype.$moment = moment
Vue.use(CoreuiVue)
Vue.use(FilbertUtils)
Vue.use(VueSweetalert2)
Vue.use(VCalendar)

/* eslint-disable no-new */

new Vue({
  components: { App },
  router,
  store,
  icons,
  template: '<App/>'
}).$mount('#app')
