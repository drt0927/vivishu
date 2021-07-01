<template>
  <div style="min-height:1000px;">
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
                  v-model="search.name"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="연락처"
                  placeholder="연락처를 입력해 주세요. [like]"
                  v-model="search.contact"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CInput
                  label="매니저"
                  placeholder="매니저를 입력해 주세요. [like]"
                  v-model="search.owner"
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
          <CButton type="button" size="sm" color="primary" @click="goWrite">추가</CButton>
          <CButton type="submit" size="sm" color="success" class="float-right" @click="find">검색</CButton>
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
        <template #owner="{item}">
          <td>
            <span v-c-tooltip="{content: item.description}">
              {{item.owner}}
            </span>
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
  name: 'stores',
  data () {
    return {
      bind: {
        isCollapsed: true
      },
      search: {
        name: '',
        contact: '',
        owner: '',
        description: ''
      },
      list: {
        rows: [],
        fields: [
          { key: 'name', label: '지점명' },
          { key: 'contact', label: '연락처' },
          { key: 'deliveryCode', label: '배송코드' },
          { key: 'owner', label: '매니저' },
          { key: 'btnDetail', label: '상세' }
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
      let db = this.$db.stores
      await db.find(
        this.search
        , { name: 1 }
        , this.list)
    },
    goWrite () {
      this.$router.push({ path: '/stores/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/stores/${id}` })
    }
  },
  mounted () {
    this.find()
  }
}
</script>

<style>

</style>