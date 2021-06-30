<template>
  <div style="min-height:1000px;">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>고객 관리 </strong> <small>검색</small>
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
          <CButton type="submit" size="sm" color="success" @click="find"><CIcon name="cil-check-circle"/> 검색</CButton>
          <CButton type="button" size="sm" color="primary" @click="goWrite"><CIcon name="cil-pencil"/> 생성</CButton>
        </CCardFooter>
      </CCard>
    </transition>

    <CCard>
      <CDataTable
        :items="list.rows"
        :fields="list.fields"
        :items-per-page="list.perPage"
        hover
      >
        <template #contact="{item}">
          <td class="address">
            <span v-c-tooltip="{content: item.address}">
              {{item.contact}}
            </span>
          </td>
        </template>
        <template #isEventAlarm="{item}">
          <td class="is-event-alarm">
            <h5><CBadge :color="item.isEventAlarm ? 'success' : 'danger'" v-c-tooltip="{content: item.description}">{{item.isEventAlarm ? "알림" : "미알림"}}</CBadge></h5>
          </td>
        </template>
        <template #btnDetail="{item}">
          <td>
            <CButton
            color="primary"
            variant="outline"
            square
            size="sm"
            @click="goDetail(item._id)"
          >
            상세
          </CButton>
          </td>
        </template>
      </CDataTable>
      
      <CPagination
        :activePage.sync="list.currentPage"
        :pages="list.totalPages"
        align="center"
      />
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'customers',
  data () {
    return {
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
          { key: 'name', label: '이름', _classes: 'name' },
          { key: 'contact', label: '연락처', _classes: 'contact' },
          // { key: 'address1', label: '주소', _classes: 'address' },
          { key: 'isEventAlarm', label: '행사알림', _classes: 'is-event-alarm' },
          { key: 'btnDetail', label: '상세' }
          // { key: 'description', label: '설명', _classes: 'description' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0
      }
    }
  },
  watch: {
    'list.currentPage': function () {
      this.find()
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
    goWrite () {
      this.$router.push({ path: '/customers/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/customers/${id}` })
    }
  },
  mounted () {
    this.find()
  }
}
</script>

<style>
.name {
  min-width: 80px;
}
.contact {
  min-width: 100px;
}
.is-event-alarm {
  min-width: 80px;
}
.address span {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 95%;
}
.description {
  min-width: 50px
}
.description span {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 50px;
}
</style>