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
                <CSelect
                  label="배송완료"
                  :value.sync="table.search.deliveryCompletedDate"
                  :options="bind.deliveryCompletedDate"
                  @keyup.enter="find"
                />
              </CCol>
              <CCol sm="6">
                <CInput
                  label="송장번호"
                  placeholder="송장번호를 입력해 주세요. [like]"
                  v-model="table.search.deliveryNo"
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
            <h5><CBadge :style="getTypeConvert(item.type).style" >{{getTypeConvert(item.type).label}}</CBadge></h5>
          </td>
        </template>
        <template #releaseDate="{item}">
          <td v-c-tooltip="{content: (item.description || ' ')}">
            {{item.releaseDate ? $moment(item.releaseDate).format('YYYY-MM-DD') : ''}}
          </td>
        </template>
        <template #products="{item}">
          <td>
              <ul class="products-list">
                <li v-for="product in item.products" v-bind:key="product._id">
                  {{product.no}} [ <b>{{product.amount}}</b> - <i>{{product.description}}</i> ]
                </li>
              </ul>
          </td>
        </template>
        <template #delivery="{item}">
          <td v-c-tooltip="{content: (item.deliveryNo || ' ')}">
            <span v-if="!item.deliveryNo || item.deliveryCompany === 0">
              {{getDeliveryCode(item.deliveryCompany).label}}
            </span>
            <a v-else
            :href="'https://tracker.delivery/#/' + getDeliveryCode(item.deliveryCompany).code + '/' + item.deliveryNo"
            target="_blank">
              {{getDeliveryCode(item.deliveryCompany).label}}
            </a>
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
          { value: 3, label: '롯데' },
          { value: 4, label: '수선' }
        ],
        isCollapsed: true
      },
      table: {
        rows: [],
        fields: [
          { key: 'createDate', label: '작성일', _style: 'width: 100px;' },
          { key: 'name', label: '주문자명', _style: 'width: 100px;' },
          { key: 'products', label: '품번' },
          { key: 'type', label: '구분' },
          { key: 'releaseDate', label: '출고일', _style: 'width: 100px;' },
          { key: 'delivery', label: '배송' },
          { key: 'btnDetail', label: '상세' }
        ],
        currentPage: 1,
        perPage: 15,
        totalPages: 0,
        sort: {
          createDate: -1
        },
        search: {
          name: '',
          type: '',
          deliveryCompletedDate: '',
          deliveryNo: '',
          getQuery () {
            let query = {
              name: !this.name ? '' : { $regex: new RegExp(this.name) },
              type: this.type,
              deliveryNo: !this.deliveryNo ? '' : { $regex: new RegExp(this.deliveryNo) }
            }

            if (this.deliveryCompletedDate === true) {
              query.deliveryCompletedDate = { $ne: null }
            } else if (this.deliveryCompletedDate === false) {
              query.deliveryCompletedDate = { $in: [null] }
            }

            return query
          }
        }
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
      await this.$db.orders.findForTable(this.table)
    },
    getTypeConvert (type) {
      let typeObj = {
        label: '',
        style: ''
      }

      if (type === 1) {
        typeObj.label = '매장'
        typeObj.style = 'background-color: #ccc;'
      } else if (type === 2) {
        typeObj.label = '네이버'
        typeObj.style = 'background-color: #19CE60; color: white;'
      } else if (type === 3) {
        typeObj.label = '롯데'
        typeObj.style = 'background-color: #E30613; color: white;'
      } else if (type === 4) {
        typeObj.label = '수선'
        typeObj.style = 'background-color: #4285F4; color: white;'
      } else {
        typeObj.label = ''
        typeObj.style = ''
      }

      return typeObj
    },
    getDeliveryCode (company) {
      let delivery = {
        label: '',
        code: ''
      }

      if (company === 1) {
        delivery.label = '롯데'
        delivery.code = 'kr.lotte'
      } else if (company === 2) {
        delivery.label = '로젠'
        delivery.code = 'kr.logen'
      } else if (company === 3) {
        delivery.label = '한진'
        delivery.code = 'kr.hanjin'
      } else {
        delivery.label = '기타'
        delivery.code = ''
      }

      return delivery
    },
    goWrite () {
      this.$router.push({ path: '/orders/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/orders/${id}` })
    }
  },
  async mounted () {
    await this.find()
    window.scrollTo(0, 0)
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