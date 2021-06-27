const namespaced = true

const state = {
  isLogin: false,
  loginDateTime: null,
  user: {}
}

const getters = {
  getUser (state) {
    return state.user
  }
}

const mutations = {
  goLogin (state, payload) {
    state.isLogin = payload.isLogin
    state.loginDateTime = payload.loginDateTime
    state.user = payload.user
  },
  logout (state) {
    state.isLogin = false
    state.loginDateTime = null
    state.user = {}
  }
}

const actions = {
  goLogin ({ commit }, payload) {
    commit('goLogin', payload)
  },
  logout ({ commit }) {
    commit('logout')
  }
}

export default {
  namespaced,
  state,
  mutations,
  actions,
  getters
}
