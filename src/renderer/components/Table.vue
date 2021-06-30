<template>
  <CCard>
    <CDataTable>
    <!-- :items="list.customers"
      :fields="list.fields"
      :items-per-page="list.perPage" -->
      <!-- <template #isEventAlarm="{item}">
        <td>
          <CBadge :color="item.isEventAlarm ? 'success' : 'danger'">{{item.isEventAlarm ? "알림" : "미알림"}}</CBadge>
        </td>
      </template> -->
    </CDataTable>
    
    <CPagination/>
    <!-- :activePage.sync="list.currentPage"
      :pages="list.totalPages"
      align="center" -->
  </CCard>
</template>

<script>
export default {

}
</script>

<style>

</style>