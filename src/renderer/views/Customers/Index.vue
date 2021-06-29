<template>
  <div>
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>고객 관리 </strong> <small>검색</small>
          <div class="card-header-actions">
            <CLink class="card-header-action btn-minimize" @click="bindModel.isCollapsed = !bindModel.isCollapsed">
              <CIcon :name="`cil-chevron-${bindModel.isCollapsed ? 'bottom' : 'top'}`"/>
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse :show="bindModel.isCollapsed" :duration="400">
          <CCardBody>
            <CRow>
              <CCol sm="4">
                <CInput
                  label="이름"
                  placeholder="이름을 입력해 주세요. [like]"
                  v-model="searchModel.name"
                />
              </CCol>
              <CCol sm="4">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [equal]"
                  v-model="searchModel.contact"
                />
              </CCol>
              <CCol sm="4">
                <CSelect
                  label="행사 알림"
                  :value.sync="searchModel.isEventAlarm"
                  :options="bindModel.isEventAlarmOptions"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="주소 1"
                  placeholder="ex) 경기도 용인시 기흥구 [equal]"
                  v-model="searchModel.address1"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="주소 2"
                  placeholder="ex) 경기도 용인시 기흥구 [equal]"
                  v-model="searchModel.address2"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
        <CCardFooter>
          <CButton type="submit" size="sm" color="success" @click="search"><CIcon name="cil-check-circle"/> 검색</CButton>
          <CButton type="button" size="sm" color="primary" @click="goWrite"><CIcon name="cil-pencil"/> 생성</CButton>
        </CCardFooter>
      </CCard>
    </transition>

    <CDataTable
      :items="customers"
      :fields="tableFields"
      :items-per-page="pagination.perPage"
    >
      <!-- <template #status="{item}">
        <td>
          <CBadge :color="getBadge(item.status)">{{item.status}}</CBadge>
        </td>
      </template> -->
    </CDataTable>
    
    <CPagination
      :activePage.sync="pagination.currentPage"
      :pages="pagination.totalRows"
      size="sm"
      align="center"
    />
  </div>
</template>

<script>
export default {
  name: 'customers',
  data () {
    return {
      bindModel: {
        isEventAlarmOptions: [
          { value: '', label: '전체' },
          { value: true, label: '알림' },
          { value: false, label: '미알림' }
        ],
        isCollapsed: true
      },
      searchModel: {
        name: '',
        contact: '',
        isEventAlarm: '',
        address1: '',
        address2: ''
      },
      tableFields: [
        { key: 'name', label: '이름' },
        { key: 'contact', label: '연락처' },
        { key: 'address1', label: '주소1' },
        { key: 'address2', label: '주소2' },
        { key: 'isEventAlarm', label: '행사알림' },
        { key: 'description', label: '설명' }
      ],
      customers: [],
      pagination: {
        currentPage: 1,
        perPage: 5,
        totalRows: 0,
        isBusy: false
      }
    }
  },
  watch: {
    'pagination.currentPage': function () {
      this.search()
    }
  },
  methods: {
    search () {
      let vm = this

      let query = {}

      if (vm.searchModel.name) {
        query.name = new RegExp(vm.searchModel.name)
      }

      if (vm.searchModel.contact) {
        query.contact = new RegExp(vm.searchModel.contact)
      }

      if (vm.searchModel.isEventAlarm !== '') {
        query.isEventAlarm = vm.searchModel.isEventAlarm
      }

      if (vm.searchModel.address1) {
        query.address1 = new RegExp(vm.searchModel.address1)
      }

      if (vm.searchModel.address2) {
        query.address2 = new RegExp(vm.searchModel.address2)
      }

      vm.$db.customers.count(query, (cntErr, count) => {
        console.log(count)
        if (cntErr) {
          vm.pagination.isBusy = false
        }

        vm.pagination.totalRows = Math.ceil(count / vm.pagination.perPage)
      })

      this.$db.customers.find(query)
        .sort({ name: 1 })
        .skip((vm.pagination.currentPage - 1) * vm.pagination.perPage)
        .limit(vm.pagination.perPage)
        .exec((err, rows) => {
          if (err) {
            vm.pagination.isBusy = false
            return
          }
          vm.pagination.isBusy = false
          vm.customers = rows
          console.log(rows)
        })
    },
    goWrite () {
      this.$router.push({ path: '/customers/write' })
    }
  },
  mounted () {
    this.search()
  }
}
</script>

<style>

</style>