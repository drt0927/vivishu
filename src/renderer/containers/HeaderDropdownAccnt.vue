<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink>
        <div class="c-avatar">
          <img
            src="~@/assets/vivishu2.png"
            class="c-avatar-img"
          />
        </div>
      </CHeaderNavLink>
    </template>
    <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>Account</strong>
    </CDropdownHeader>
    <CDropdownItem @click="goRegister" v-show="id === 'admin'">
      <CIcon name="cil-user"/> 직원 계정 생성
    </CDropdownItem>
    <CDropdownItem @click="userLogout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
  </CDropdown>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'HeaderDropdownAccnt',
  data () {
    return {
      itemsCount: 42
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'Auth/isLogin',
      id: 'Auth/id'
    })
  },
  methods: {
    ...mapActions('Auth', [
      'logout'
    ]),
    userLogout () {
      this.logout()
      this.$router.push('login')
    },
    goRegister () {
      this.$router.push({ path: '/register' })
    }
  }
}
</script>

<style scoped>
.c-icon {
    margin-right: 0.3rem;
  }
.c-avatar {
  width: 50px;
  height: 50px;
}
</style>