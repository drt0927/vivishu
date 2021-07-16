<template>
  <div style="min-height:1000px;">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>수평이동 관리 </strong> <small>목록</small>
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
                  label="지점명"
                  placeholder="지점명을 입력해 주세요. [like]"
                  v-model="table.search.name"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  label="구분"
                  :value.sync="table.search.type"
                  :options="bind.type"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="품번"
                  placeholder="품번를 입력해 주세요. [like]"
                  v-model="table.search.no"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  label="확정여부"
                  :value.sync="table.search.isConfirm"
                  :options="bind.isConfirm"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
          </CCardBody>
        </CCollapse>
        <CCardFooter>
          <CButton type="button" size="sm" color="primary" @click="goWrite">추가</CButton>
          <CButton type="submit" size="sm" color="success" class="float-right" @click="find">검색</CButton>
        </CCardFooter>
      </CCard>
    </transition>

    <CCard>
      <CDataTable
        :items="table.rows"
        :fields="table.fields"
        :items-per-page="table.perPage"
        hover
      >
        <template #createDate="{item}">
          <td>
            {{$moment(item.createDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #type="{item}">
          <td>
            <h5>
              <CBadge :color="getTypeStyle(item.type).color" >
                <CIcon :name="getTypeStyle(item.type).icon" />
                {{getTypeStyle(item.type).label}}
              </CBadge>
            </h5>
          </td>
        </template>
        <template #tradeDate="{item}">
          <td>
            {{$moment(item.tradeDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #isConfirm="{item}">
          <td>
            <CSwitch
              class="mr-1"
              color="primary"
              disabled
              :checked="item.isConfirm"
            />
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
        :activePage.sync="table.currentPage"
        :pages="table.totalPages"
        align="center"
      />
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'trades',
  data () {
    return {
      table: {
        rows: [],
        fields: [
          { key: 'createDate', label: '작성일', _style: 'width: 100px;' },
          { key: 'name', label: '지점명' },
          { key: 'type', label: '구분', _style: 'width: 100px;' },
          { key: 'tradeDate', label: '거래일', _style: 'width: 100px;' },
          { key: 'no', label: '품번' },
          { key: 'amount', label: '수량' },
          { key: 'isConfirm', label: '확정' },
          { key: 'btnDetail', label: '상세' }
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
              type: this.type,
              no: !this.no ? '' : { $regex: new RegExp(this.no) },
              isConfirm: this.isConfirm
            }
          }
        }
      },
      bind: {
        type: [
          { value: '', label: '전체' },
          { value: 1, label: '입고' },
          { value: 2, label: '출고' }
        ],
        isConfirm: [
          { value: '', label: '전체' },
          { value: true, label: '확정' },
          { value: false, label: '미확정' }
        ],
        isCollapsed: true
      }
    }
  },
  watch: {
    'table.currentPage': async function () {
      await this.find()
    }
  },
  methods: {
    async find () {
      await this.$db.trades.findForTable(this.table)
    },
    getTypeStyle (type) {
      if (type === 1) {
        return {
          label: '입고',
          icon: 'cil-level-down',
          color: 'success'
        }
      } else if (type === 2) {
        return {
          label: '출고',
          icon: 'cil-level-up',
          color: 'secondary'
        }
      }
    },
    goWrite () {
      this.$router.push({ path: '/trades/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/trades/${id}` })
    }
  },
  async mounted () {
    await this.find()
    window.scrollTo(0, 0)
  }
}
</script>

<style>

</style>