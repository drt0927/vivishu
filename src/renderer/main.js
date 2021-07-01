import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'

// import db from './datastore'
import db from './datastore/index'
import FilbertUtils from './plugin/utils'

import CoreuiVue from '@coreui/vue'
import { iconsSet as icons } from './assets/icons/icons.js'
import VueSweetalert2 from 'vue-sweetalert2'
import VueDaumPostcode from 'vue-daum-postcode'
import VCalendar from 'v-calendar'
import moment from 'moment'

// import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

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
Vue.use(VueDaumPostcode)
Vue.use(VCalendar)

// Vue.use(BootstrapVue)
// Vue.use(IconsPlugin)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  icons,
  template: '<App/>'
}).$mount('#app')
