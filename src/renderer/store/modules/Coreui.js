const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: false
}

const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  }
}

const actions = {
  toggleSidebarDesktop ({ commit }) {
    // do something async
    commit('toggleSidebarDesktop')
  },
  toggleSidebarMobile ({ commit }) {
    // do something async
    commit('toggleSidebarMobile')
  },
  set ({ commit }, [variable, value]) {
    // do something async
    commit('set', [variable, value])
  }
}

export default {
  state,
  mutations,
  actions
}
