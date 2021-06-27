<template>
  <CSidebar 
    fixed 
    :minimize="minimize"
    :show="show"
    @update:show="(value) => $store.dispatch('set', ['sidebarShow', value])"
  >
    <CSidebarBrand class="d-md-down-none" to="/" style="text-decoration: none;">
    <div class="c-sidebar-brand-full">
      VIVISHU<img src="~@/assets/vivishu.png"/>
    </div>
    <div class="c-sidebar-brand-minimized">
      <img src="~@/assets/vivishu.png"/>
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

export default {
  name: 'Sidebar',
  nav,
  computed: {
    show () {
      return this.$store.state.Coreui.sidebarShow
    },
    minimize () {
      return this.$store.state.Coreui.sidebarMinimize
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Lato&display=swap');

.c-sidebar {
  background: #F87499;
}

.c-sidebar-brand-full {
  font-family: 'Lato', sans-serif;
  font-size: 35px;
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