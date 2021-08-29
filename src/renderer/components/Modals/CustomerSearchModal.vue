<template>
  <CModal title="고객 검색" size="xl" :show.sync="isShow">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>고객 관리 </strong> <small>목록</small>
          <div class="card-header-actions">
            <CLink class="card-header-action btn-minimize" @click="bind.isCollapsed = !bind.isCollapsed">
              <CIcon :name="`cil-chevron-${bind.isCollapsed ? 'bottom' : 'top'}`"/>
            </CLink>
          </div>
        </CCardHeader>
        <CCollapse :show="bind.isCollapsed" :duration="400">
          <CCardBody>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="이름"
                  placeholder="이름을 입력해 주세요. [like]"
                  v-model="table.search.name"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [equal]"
                  v-model="table.search.contact"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  label="행사 알림"
                  :value.sync="table.search.isEventAlarm"
                  :options="bind.isEventAlarmOptions"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="설명"
                  placeholder="설명을 입력해 주세요. [like]"
                  v-model="table.search.description"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
        <CCardFooter>
          <CButton type="submit" size="sm" color="primary" @click="goWrite">추가</CButton>
          <CButton type="submit" size="sm" color="success" class="float-right" @click="find">검색</CButton>
        </CCardFooter>
      </CCard>
    </transition>
    <CCard>
      <CDataTable
        :items="table.rows"
        :fields="table.fields"
        :items-per-page="table.perPage"
        @row-clicked="selected"
        hover
        >
        <template #contact="{item}">
          <td>
            <span v-c-tooltip="{content: item.address}">
              {{$utils.masking.phone(item.contact)}}
            </span>
          </td>
        </template>
        <template #isEventAlarm="{item}">
          <td>
            <h5><CBadge :color="item.isEventAlarm ? 'success' : 'danger'" v-c-tooltip="{content: item.description}">{{item.isEventAlarm ? "알림" : "미알림"}}</CBadge></h5>
          </td>
        </template>
      </CDataTable>
      
      <CPagination
        :activePage.sync="table.currentPage"
        :pages="table.totalPages"
        align="center"
      />
    </CCard>
    <template #footer>
      <div></div>
    </template>
  </CModal>
</template>

<script>
export default {
  name: 'customer-search-modal',
  data () {
    return {
      table: {
        rows: [],
        fields: [
          { key: 'name', label: '이름' },
          { key: 'contact', label: '연락처' },
          { key: 'isEventAlarm', label: '행사알림' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0,
        search: {
          name: '',
          contact: '',
          isEventAlarm: '',
          description: '',
          getQuery () {
            return {
              name: !this.name ? '' : { $regex: new RegExp(this.name) },
              contact: this.contact,
              isEventAlarm: this.isEventAlarm,
              description: !this.description ? '' : { $regex: new RegExp(this.description) }
            }
          }
        }
      },
      bind: {
        isEventAlarmOptions: [
          { value: '', label: '전체' },
          { value: true, label: '알림' },
          { value: false, label: '미알림' }
        ],
        isCollapsed: true
      }
    }
  },
  methods: {
    async find () {
      await this.$db.customers.findForTable(this.table)
    },
    selected (item) {
      this.$emit('selected', item._id, item.name, item.address)
      this.isShow = false
    },
    goWrite () {
      this.$router.push({ path: '/customers/write' })
    }
  },
  async mounted () {
    await this.find()
  },
  watch: {
    'table.currentPage': function () {
      this.find()
    }
  },
  props: {
    show: { type: Boolean }
  },
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  }
}
</script>

<style>

</style>