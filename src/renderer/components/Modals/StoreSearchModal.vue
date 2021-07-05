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
                  v-model="search.name.value"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [equal]"
                  v-model="search.contact.value"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="매니저"
                  placeholder="매니저를 입력해 주세요. [like]"
                  v-model="search.owner.value"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="메모"
                  placeholder="메모를 입력해 주세요. [like]"
                  v-model="search.description.value"
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
        :items="list.rows"
        :fields="list.fields"
        :items-per-page="list.perPage"
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
  name: 'store-search-modal',
  data () {
    return {
      date: new Date(),
      bind: {
        isCollapsed: true
      },
      search: {
        name: {
          operator: this.$utils.enums.NedbQueryOperators.Regex,
          value: ''
        },
        contact: {
          operator: this.$utils.enums.NedbQueryOperators.Regex,
          value: ''
        },
        owner: {
          operator: this.$utils.enums.NedbQueryOperators.Regex,
          value: ''
        },
        description: {
          operator: this.$utils.enums.NedbQueryOperators.Regex,
          value: ''
        }
      },
      list: {
        rows: [],
        fields: [
          { key: 'name', label: '지점명' },
          { key: 'contact', label: '연락처' },
          { key: 'deliveryCode', label: '배송코드' },
          { key: 'owner', label: '매니저' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0
      }
    }
  },
  methods: {
    async find () {
      let db = this.$db.stores
      await db.find(
        this.search
        , { name: 1 }
        , this.list)
    },
    selected (item) {
      this.$emit('selected', item._id, item.name)
      this.isShow = false
    },
    goWrite () {
      this.$router.push({ path: '/stores/write' })
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