<template>
  <CHeader fixed with-subheader light>
    <CToggler
      in-header
      class="ml-3 d-lg-none"
      @click="$store.dispatch('toggleSidebarMobile')"
    />
    <CToggler
      in-header
      class="ml-3 d-md-down-none"
      @click="$store.dispatch('toggleSidebarDesktop')"
    />
    <CHeaderBrand class="mx-auto d-lg-none" to="/">
      비비슈
    </CHeaderBrand>
    <CHeaderNav class="d-md-down-none mr-auto">
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">
          Dashboard
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>
          Users
        </CHeaderNavLink>
      </CHeaderNavItem>
      <CHeaderNavItem class="px-3">
        <CHeaderNavLink>
          Settings
        </CHeaderNavLink>
      </CHeaderNavItem> -->
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <CHeaderNavItem class="d-md-down-none mx-2">
        {{id}} <b>{{welcomeMessage}}</b>
      </CHeaderNavItem>
      <HeaderDropdownAccnt/>
    </CHeaderNav>
    <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0 mb-0"/>
    </CSubheader>
  </CHeader>
</template>

<script>
import HeaderDropdownAccnt from './HeaderDropdownAccnt'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  data () {
    return {
      welcomeMessage: ''
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'Auth/isLogin',
      id: 'Auth/id'
    })
  },
  components: {
    HeaderDropdownAccnt
  },
  mounted () {
    let messages = [
      '일하는 중!!😊',
      '출근함!!👍',
      '화이팅!!😍',
      '많이 팔아!!🤑',
      '만반잘부!!😎'
    ]

    let ran = Math.floor(Math.random() * (messages.length - 0) + 0)
    this.welcomeMessage = messages[ran]
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.c-header {
  background: #F2D0E2;
}
.c-header .c-header-brand {
  font-family: 'Lato', sans-serif;
  font-size: 30px;
  text-decoration: none;
}
</style>