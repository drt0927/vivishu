<template>
  <CModal title="지점 검색" size="xl" :show.sync="isShow">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>지점 관리 </strong> <small>목록</small>
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
                <CInput
                  label="매니저"
                  placeholder="매니저를 입력해 주세요. [like]"
                  v-model="table.search.owner"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="메모"
                  placeholder="메모를 입력해 주세요. [like]"
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
        <template #owner="{item}">
          <td>
            <span v-c-tooltip="{content: item.description}">
              {{item.owner}}
            </span>
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
  name: 'store-search-modal',
  data () {
    return {
      table: {
        rows: [],
        fields: [
          { key: 'name', label: '지점명' },
          { key: 'contact', label: '연락처' },
          { key: 'deliveryCode', label: '배송코드' },
          { key: 'owner', label: '매니저' }
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
              contact: !this.contact ? '' : { $regex: new RegExp(this.contact) },
              owner: !this.owner ? '' : { $regex: new RegExp(this.owner) },
              description: !this.description ? '' : { $regex: new RegExp(this.description) }
            }
          }
        }
      },
      bind: {
        isCollapsed: true
      }
    }
  },
  methods: {
    async find () {
      await this.$db.stores.findForTable(this.table)
    },
    selected (item) {
      this.$emit('selected', item._id, item.name)
      this.isShow = false
    },
    goWrite () {
      this.$router.push({ path: '/stores/write' })
    }
  },
  async mounted () {
    await this.find()
  },
  watch: {
    'table.currentPage': async function () {
      await this.find()
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