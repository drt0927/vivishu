<template>
  <div>
    <MonthSales v-show="id === 'admin'"/>
    <ExpenseStat v-show="id === 'admin'"/>
    <CRow>
      <CCol sm="12" md="6" lg="6">
        <Top5Todos/>
      </CCol>
      <CCol sm="12" md="6" lg="6">
        <Top5Schedules/>
      </CCol>
    </CRow>
    <Top10Orders/>
  </div>
</template>

<script>
import Widgets from '../components/DashboardWidgets'
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  components: Widgets,
  computed: {
    ...mapGetters({
      isLogin: 'Auth/isLogin',
      id: 'Auth/id'
    })
  }
}
</script>

<style>

</style>