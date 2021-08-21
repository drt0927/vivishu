<template>
  <CCard>
    <CCardHeader>
      <strong>Todo</strong> <small>완료되지 않은 할 일 (오래된순)</small>
    </CCardHeader>
    <CDataTable
      class="mb-0 table-outline"
      hover
      :items="rows"
      :fields="fields"
      head-color="light"
      no-sorting
    >
      <td slot="createDate" slot-scope="{item}">
        {{$moment(item.createDate).format('YYYY-MM-DD')}}
      </td>
    </CDataTable>
  </CCard>
</template>

<script>
export default {
  name: 'Top5Todos',
  data () {
    return {
      rows: [],
      fields: [
        { key: 'createDate', label: '생성일' },
        { key: 'contents', label: '내용' }
      ]
    }
  },
  async mounted () {
    // 완료되지 않은 할 일 (오래된순) 5개
    let todosFind = await this.$db.todos.find({ isCompleted: false }, { createDate: 1 }, 0, 5)
    if (todosFind.isSuccess) {
      this.rows = todosFind.result
    }
  }
}
</script>

<style>

</style>