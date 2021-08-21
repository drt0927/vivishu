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
      <!-- <CBadge color="info" class="mfs-auto">{{ itemsCount }}</CBadge> -->
    </CDropdownItem>
    <CDropdownItem @click="userLogout">
      <CIcon name="cil-lock-locked" /> Logout
    </CDropdownItem>
    <!-- <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>Settings</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-user" /> Profile
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownDivider/>
    <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem> -->
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