<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.dispatch('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/" style="text-decoration: none;">
    <div class="c-sidebar-brand-full">
      비비슈<img src="~@/assets/vivishu1.png"/>
    </div>
    <div class="c-sidebar-brand-minimized">
      <img src="~@/assets/vivishu3.png"/>
    </div>
    </CSidebarBrand>

    <CRenderFunction flat :content-to-render="$options.nav"/>
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="$store.dispatch('set', ['sidebarMinimize', !minimize])"
    />
  </CSidebar>
</template>

<script>
import nav from './_nav'
import { mapGetters } from 'vuex'

export default {
  name: 'Sidebar',
  nav,
  computed: {
    ...mapGetters({
      isLogin: 'Auth/isLogin',
      id: 'Auth/id'
    }),
    show () {
      return this.$store.state.Coreui.sidebarShow
    },
    minimize () {
      return this.$store.state.Coreui.sidebarMinimize
    }
  },
  created () {
    if (this.id !== 'admin') {
      this.$options.nav[0]._children.filter((x) => x.type === 99).forEach((e) => {
        e._attrs = { class: 'sidebar-hide' }
      })
    } else {
      this.$options.nav[0]._children.filter((x) => x.type === 99).forEach((e) => {
        if (e._name === 'CSidebarNavTitle') {
          e._attrs = { class: 'c-sidebar-nav-title' }
        } else if (e._name === 'CSidebarNavItem') {
          e._attrs = { class: 'c-sidebar-nav-item' }
        }
      })
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.sidebar-hide {
  display: none;
}

.c-sidebar {
  background: #F87499;
}

.c-sidebar-brand-full {
  font-family: 'Lato', sans-serif;
  font-size: 30px;
}

.c-sidebar-brand-full img {
  width: 45px;
  vertical-align: middle;
  margin-top: -10px;
}

.c-sidebar-brand-minimized img {
  width: 45px;
}

@media (hover: hover), not all {
  .c-sidebar .c-sidebar-nav-link:hover, .c-sidebar .c-sidebar-nav-dropdown-toggle:hover {
    color: #fff;
    background: #F2D0E2;
  }
}

.c-sidebar.c-sidebar-minimized .c-sidebar-nav-item:hover > .c-sidebar-nav-link, .c-sidebar.c-sidebar-minimized .c-sidebar-nav-item:hover > .c-sidebar-nav-dropdown-toggle {
  background: #F2D0E2;
}

.c-sidebar.c-sidebar-minimized .c-sidebar-nav > .c-sidebar-nav-dropdown:hover {
  background: #F2D0E2;
}
</style>