<template>
  <div style="height:1000px;">
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
              <CCol sm="4">
                <CInput
                  label="이름"
                  placeholder="이름을 입력해 주세요. [like]"
                  v-model="search.name"
                />
              </CCol>
              <CCol sm="4">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [equal]"
                  v-model="search.contact"
                />
              </CCol>
              <CCol sm="4">
                <CSelect
                  label="행사 알림"
                  :value.sync="search.isEventAlarm"
                  :options="bind.isEventAlarmOptions"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="주소 1"
                  placeholder="ex) 경기도 용인시 기흥구 [equal]"
                  v-model="search.address1"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="주소 2"
                  placeholder="ex) 경기도 용인시 기흥구 [equal]"
                  v-model="search.address2"
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
        <template #address1="{item}">
          <td class="address">
            <span v-c-tooltip="{content: item.address1}">
              {{item.address1}}
            </span>
          </td>
        </template>
        <template #isEventAlarm="{item}">
          <td class="is-event-alarm">
            <CBadge :color="item.isEventAlarm ? 'success' : 'danger'">{{item.isEventAlarm ? "알림" : "미알림"}}</CBadge>
          </td>
        </template>
        <!-- <template #description="{item}">
          <td class="description">
            <span v-c-tooltip="{content: item.description}">
              {{item.description}}
            </span>
          </td>
        </template> -->
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
        address1: '',
        address2: ''
      },
      list: {
        rows: [],
        fields: [
          { key: 'name', label: '이름', _classes: 'name' },
          { key: 'contact', label: '연락처', _classes: 'contact' },
          { key: 'address1', label: '주소1', _classes: 'address' },
          { key: 'isEventAlarm', label: '행사알림', _classes: 'is-event-alarm' }
          // { key: 'description', label: '설명', _classes: 'description' }
        ],
        currentPage: 1,
        perPage: 5,
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
      await this.$db.customers.find(
        this.search
        , { name: 1 }
        , this.list)
    },
    goWrite () {
      this.$router.push({ path: '/customers/write' })
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