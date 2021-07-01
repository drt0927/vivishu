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
                  v-model="search.name"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [equal]"
                  v-model="search.contact"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  label="행사 알림"
                  :value.sync="search.isEventAlarm"
                  :options="bind.isEventAlarmOptions"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="설명"
                  placeholder="설명을 입력해 주세요. [like]"
                  v-model="search.description"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
        <CCardFooter>
          <CButton type="submit" size="sm" color="success" class="float-right" @click="find">검색</CButton>
        </CCardFooter>
      </CCard>
    </transition>
    <CCard>
      <CDataTable
        :items="list.rows"
        :fields="list.fields"
        :items-per-page="list.perPage"
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
        :activePage.sync="list.currentPage"
        :pages="list.totalPages"
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
      date: new Date(),
      bind: {
        isEventAlarmOptions: [
          { value: '', label: '전체' },
          { value: true, label: '알림' },
          { value: false, label: '미알림' }
        ],
        isCollapsed: true
      },
      search: {
        name: '',
        contact: '',
        isEventAlarm: '',
        description: ''
      },
      list: {
        rows: [],
        fields: [
          { key: 'name', label: '이름' },
          { key: 'contact', label: '연락처' },
          { key: 'isEventAlarm', label: '행사알림' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0
      }
    }
  },
  methods: {
    async find () {
      let db = this.$db.customers
      await db.find(
        this.search
        , { name: 1 }
        , this.list)
    },
    selected (item) {
      this.$emit('selected', item._id, item.name)
      this.isShow = false
    }
  },
  mounted () {
    this.find()
  },
  watch: {
    'list.currentPage': function () {
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