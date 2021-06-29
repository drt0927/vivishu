const namespaced = true

const state = {
  isLogin: false,
  loginDateTime: null,
  user: {
    id: String,
    name: String
  }
}

const getters = {
  isLogin (state) {
    return state.isLogin && state.user.name
  }
}

const mutations = {
  login (state, payload) {
    state.isLogin = true
    state.loginDateTime = new Date()
    state.user = payload
  },
  logout (state) {
    state.isLogin = false
    state.loginDateTime = null
    state.user = {
      id: String,
      name: String
    }
  }
}

const actions = {
  login ({ commit }, payload) {
    commit('login', payload)
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
