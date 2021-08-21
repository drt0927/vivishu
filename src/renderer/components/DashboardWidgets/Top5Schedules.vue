<template>
  <CCard>
    <CCardHeader>
      <strong>일정</strong> <small>종료일 임박순</small>
    </CCardHeader>
    <CDataTable
      class="mb-0 table-outline"
      hover
      :items="rows"
      :fields="fields"
      head-color="light"
      no-sorting
    >
      <td slot="endDate" slot-scope="{item}">
        {{$moment(item.endDate).format('YYYY-MM-DD')}}
      </td>
    </CDataTable>
  </CCard>
</template>

<script>
export default {
  name: 'Top5Schedules',
  data () {
    return {
      rows: [],
      fields: [
        { key: 'title', label: '제목' },
        { key: 'contents', label: '내용' },
        { key: 'endDate', label: '종료일' }
      ]
    }
  },
  async mounted () {
    // 최근 일정 5개
    let schedulesFind = await this.$db.schedules.find({ endDate: { $gte: new Date() } }, { endDate: 1 }, 0, 5)
    if (schedulesFind.isSuccess) {
      this.rows = schedulesFind.result
    }
  }
}
</script>

<style>

</style>