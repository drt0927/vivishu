<template>
  <div>
    <CCard>
      <CCardHeader>
        <CIcon name="cil-justify-center"/><strong> Todo </strong><small>할 일 목록</small>
        <div class="card-header-actions">
          <CButtonGroup size="sm">
            <CButton color="dark" :variant="allButtonVariant" v-c-tooltip="'전체'" @click="setCompleted('')">📋 전체</CButton>
            <CButton color="success" :variant="activeButtonVariant" v-c-tooltip="'미완료'" @click="setCompleted(false)">😥 미완료</CButton>
            <CButton color="info" :variant="completedButtonVariant" v-c-tooltip="'완료'" @click="setCompleted(true)">😃 완료</CButton>
          </CButtonGroup>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput placeholder="할 일을 작성해 주세요." v-model="todoContents" @keyup.enter="add"></CInput>
        <CListGroup>
          <CListGroupItem
            v-for="todo in todos"
            v-bind:key="todo._id"
            tag="button"
          >
            <CSwitch class="mx-1" color="success" :checked.sync="todo.isCompleted" @change.native="todoChanged(todo)" shape="pill" v-bind="labelIcon" />
            {{todo.contents}}
            <CButton size="sm" class="float-right" @click="remove(todo._id)">
              <CIcon name="cil-x"/>
            </CButton>
          </CListGroupItem>
        </CListGroup>
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'todos',
  data () {
    return {
      db: this.$db.todos,
      todoContents: '',
      search: {
        isCompleted: false
      },
      labelIcon: {
        labelOn: '\u2713',
        labelOff: '\u2715'
      },
      todos: []
    }
  },
  computed: {
    allButtonVariant () {
      return this.search.isCompleted === '' ? '' : 'outline'
    },
    activeButtonVariant () {
      return this.search.isCompleted === false ? '' : 'outline'
    },
    completedButtonVariant () {
      return this.search.isCompleted === true ? '' : 'outline'
    }
  },
  methods: {
    async add () {
      let todo = this.db.getDocument()
      todo.contents = this.todoContents
      todo.isCompleted = false

      let add = await this.db.add(todo)
      if (!add.isSuccess) {
        console.log(add.result)
        alert('Todo 정보 추가를 실패하였습니다.')
        return
      }

      this.todoContents = ''
      this.find()
    },
    async remove (id) {
      let remove = await this.db.remove(id)
      if (!remove.isSuccess) {
        alert('Todo 정보를 삭제하지 못했습니다.')
        return
      }

      this.find()
    },
    async find () {
      let query = {}
      if (this.search.isCompleted === true ||
      this.search.isCompleted === false) {
        query.isCompleted = this.search.isCompleted
      }
      let find = await this.db.find(query, { createDate: -1 }, 0, 9999)
      if (!find.isSuccess) {
        console.log(find.result)
        alert('Todo 정보 조회를 실패하였습니다.')
        return
      }

      this.todos = find.result
    },
    async setCompleted (isCompleted) {
      this.search.isCompleted = isCompleted
      await this.find()
    },
    async todoChanged (todo) {
      let update = await this.db.update(todo)
      if (!update.isSuccess) {
        alert('고객 정보 수정을 실패하였습니다.')
        return
      }
      await this.find()
    }
  },
  async mounted () {
    await this.find()
  }
}
</script>

<style>
.c-switch {
  vertical-align: middle;
}
</style>