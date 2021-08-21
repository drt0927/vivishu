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
    let loginTime = Date.parse(state.loginDateTime)
    if (isNaN(loginTime)) {
      return false
    }

    let today = new Date()
    let loginDate = new Date(loginTime)
    if (today.getUTCFullYear() !== loginDate.getUTCFullYear() ||
    today.getUTCMonth() !== loginDate.getUTCMonth() ||
    today.getUTCDate() !== loginDate.getUTCDate()) {
      state.isLogin = false
      state.loginDateTime = null
      state.user = {
        id: String,
        name: String
      }
      return false
    }

    return state.isLogin && state.user.name
  },
  id (state) {
    return state.user.id
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
