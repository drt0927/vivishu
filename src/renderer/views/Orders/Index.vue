<template>
  <div style="min-height:1000px;">
    <transition name="fade">
      <CCard>
        <CCardHeader>
          <strong>주문장 관리 </strong> <small>목록</small>
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
                  label="주문자명"
                  placeholder="주문자명을 입력해 주세요. [like]"
                  v-model="search.name"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CSelect
                  label="구분"
                  :value.sync="search.type"
                  :options="bind.type"
                  @keyup.enter="find"
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="6">
                <CSelect
                  label="배송완료"
                  :value.sync="search.deliveryCompletedDate"
                  :options="bind.deliveryCompletedDate"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="송장번호"
                  placeholder="송장번호를 입력해 주세요. [like]"
                  v-model="search.deliveryNo"
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
        <template #createDate="{item}">
          <td>
            {{$moment(item.createDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #type="{item}">
          <td>
            <h5><CBadge :style="getTypeColor(item.type)" >{{getTypeString(item.type)}}</CBadge></h5>
          </td>
        </template>
        <template #releaseDate="{item}">
          <td>
            {{$moment(item.releaseDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #products="{item}">
          <td>
              <ul class="products-list">
                <li v-for="product in item.products" v-bind:key="product.no">
                  {{product.no}} [ <b>{{product.amount}}</b> - <i>{{product.description}}</i> ]
                </li>
              </ul>
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
  name: 'orders',
  data () {
    return {
      bind: {
        deliveryCompletedDate: [
          { value: '', label: '전체' },
          { value: true, label: '완료' },
          { value: false, label: '미완료' }
        ],
        type: [
          { value: '', label: '전체' },
          { value: 1, label: '매장' },
          { value: 2, label: '네이버' },
          { value: 3, label: '롯데' }
        ],
        isCollapsed: true
      },
      search: {
        name: '',
        type: '',
        deliveryCompletedDate: '',
        deliveryNo: ''
      },
      list: {
        rows: [],
        fields: [
          { key: 'createDate', label: '작성일', _style: 'width: 100px;' },
          { key: 'name', label: '주문자명', _style: 'width: 100px;' },
          { key: 'type', label: '구분' },
          { key: 'releaseDate', label: '출고일', _style: 'width: 100px;' },
          { key: 'products', label: '품번' },
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
      let db = this.$db.orders
      await db.find(
        this.search
        , { createDate: -1 }
        , this.list)
    },
    getTypeString (type) {
      if (type === 1) {
        return '매장'
      } else if (type === 2) {
        return '네이버'
      } else if (type === 3) {
        return '롯데'
      }
    },
    getTypeColor (type) {
      if (type === 1) {
        return 'background-color: #ccc;'
      } else if (type === 2) {
        return 'background-color: #19CE60; color: white;'
      } else if (type === 3) {
        return 'background-color: #E30613; color: white;'
      }
    },
    goWrite () {
      this.$router.push({ path: '/orders/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/orders/${id}` })
    }
  },
  mounted () {
    this.find()
  }
}
</script>

<style>
.products-list {
  list-style-type: disc;
  margin: 0;
  padding-left: 20px;
}
</style>