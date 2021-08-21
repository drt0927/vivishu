<template>
  <div style="min-height:1000px;">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>지출 관리 </strong> <small>목록</small>
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
                <CodeSelect
                  label="지출 유형"
                  placeholder="지출유형을 선택해 주세요."
                  :code.sync="table.search.type"
                  :codeType="codeType"
                  :isSelectAll="true"
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
        <template #expenseDate="{item}">
          <td>
            {{$moment(item.expenseDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #typeName="{item}">
          <td :style="`background-color: ${$utils.common.Hex8toRgba(item.typeColor)}; font-weight: bold;`">
            {{item.typeName}}
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
import CodeSelect from '../../components/Controls/CodeSelect.vue'

export default {
  name: 'expense',
  data () {
    return {
      codeType: '지출유형',
      bind: {
        isCollapsed: true,
        types: []
      },
      table: {
        rows: [],
        fields: [
          { key: 'expenseDate', label: '지출일' },
          { key: 'typeName', label: '지출 유형' },
          { key: 'description', label: '내용' },
          { key: 'amount', label: '금액' },
          { key: 'btnDetail', label: '상세' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0,
        search: {
          type: '',
          amount: '',
          getQuery () {
            return {
              type: this.type
            }
          }
        }
      }
    }
  },
  components: {
    CodeSelect
  },
  watch: {
    'table.currentPage': async function () {
      await this.find()
    }
  },
  methods: {
    async find () {
      await this.$db.expense.findForTable(this.table, this.bind.types)
    },
    goWrite () {
      this.$router.push({ path: '/expense/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/expense/${id}` })
    }
  },
  async mounted () {
    this.bind.types = await this.$db.codes.getCodeList(this.codeType)
    await this.find()
  }
}
</script>

<style>

</style>