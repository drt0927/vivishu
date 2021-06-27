<template>
  <div class="c-app">
    <Sidebar/>
    <CWrapper>
      <Header/>
      <div class="c-body">
      <main class="c-main">
        <CContainer fluid>
        <transition name="fade" mode="out-in">
          <router-view :key="$route.path"></router-view>
        </transition>
        </CContainer>
      </main>
      </div>
      <Footer/>
    </CWrapper>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

export default {
  name: 'Container',
  components: {
    Sidebar,
    Header,
    Footer
  },
  methods: {
    ...mapActions('Auth', [
      'logout'
    ])
  },
  mounted () {
    if (!this.$store.state.Auth.isLogin) {
      this.$router.push('login')
      return
    }

    let loginTime = Date.parse(this.$store.state.Auth.loginDateTime)
    if (isNaN(loginTime)) {
      return
    }

    let today = new Date()
    let loginDate = new Date(loginTime)
    if (today.getUTCFullYear() !== loginDate.getUTCFullYear() ||
    today.getUTCMonth() !== loginDate.getUTCMonth() ||
    today.getUTCDate() !== loginDate.getUTCDate()) {
      this.logout()
      this.$router.push('login')
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>