import crypto from 'crypto'

export default {
  install (Vue) {
    Vue.prototype.$utils = {
      GetElement (vm, ref) {
        return vm.$refs[ref].$el.getElementsByTagName('input')[0]
      },
      EncrytSHA512 (payload) {
        const salt = 'rnldudnsTnguddl)3(2*1'
        return crypto.pbkdf2Sync(payload, salt, 100000, 64, 'sha512').toString('base64')
      }
    }
  }
}
