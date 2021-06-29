import utils from '../utils/utils'

export default {
  install (Vue) {
    Vue.prototype.$utils = utils
  }
}
