<template>
  <div>
    <CCard>
      <CCardBody>
        <CRow>
          <CCol sm="12" lg="6">
            <CRow style="margin-bottom: 10px;">
              <CCol sm="12" lg="12">
                <h4 id="traffic" class="card-title mb-0">Todo</h4>
                <div class="small text-muted">완료되지 않은 할 일 (오래된순)</div>
              </CCol>
            </CRow>
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="todo.rows"
              :fields="todo.fields"
              head-color="light"
              no-sorting
            >
              <td slot="createDate" slot-scope="{item}">
                {{$moment(item.createDate).format('YYYY-MM-DD')}}
              </td>
            </CDataTable>
          </CCol>
          <CCol sm="12" lg="6">
            <CRow style="margin-bottom: 10px;">
              <CCol sm="12" lg="12">
                <h4 id="traffic" class="card-title mb-0">일정</h4>
                <div class="small text-muted">종료일 임박순</div>
              </CCol>
            </CRow>
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="schedule.rows"
              :fields="schedule.fields"
              head-color="light"
              no-sorting
            >
              <td slot="endDate" slot-scope="{item}">
                {{$moment(item.endDate).format('YYYY-MM-DD')}}
              </td>
            </CDataTable>
          </CCol>
        </CRow>
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol sm="12" lg="12">
            <CRow style="margin-bottom: 10px;">
              <CCol sm="12" lg="12">
                <h4 id="traffic" class="card-title mb-0">주문장</h4>
                <div class="small text-muted">미출고 목록 (오래된순)</div>
              </CCol>
            </CRow>
            <CDataTable
              class="mb-0 table-outline"
              hover
              :items="order.rows"
              :fields="order.fields"
              head-color="light"
              no-sorting
            >
              <template #createDate="{item}">
                <td>
                  {{$moment(item.createDate).format('YYYY-MM-DD')}}
                </td>
              </template>
              <template #type="{item}">
                <td>
                  <h5><CBadge :style="getOrderTypeConvert(item.type).style" >{{getOrderTypeConvert(item.type).lable}}</CBadge></h5>
                </td>
              </template>
              <template #releaseDate="{item}">
                <td>
                  {{$moment(item.releaseDate).format('YYYY-MM-DD')}}
                </td>
              </template>
              <template #products="{item}">
                <td>
                    <ul class="products-list" v-c-tooltip="{content: item.description}">
                      <li v-for="product in item.products" v-bind:key="product._id">
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
                  @click="goOrderDetail(item._id)"
                >
                  상세
                </CButton>
                </td>
              </template>
            </CDataTable>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'dashboard',
  data () {
    return {
      todo: {
        rows: [],
        fields: [
          { key: 'createDate', label: '생성일' },
          { key: 'contents', label: '내용' }
        ]
      },
      schedule: {
        rows: [],
        fields: [
          { key: 'title', label: '제목' },
          { key: 'contents', label: '내용' },
          { key: 'endDate', label: '종료일' }
        ]
      },
      order: {
        rows: [],
        fields: [
          { key: 'createDate', label: '작성일', _style: 'width: 100px;' },
          { key: 'name', label: '주문자명', _style: 'width: 100px;' },
          { key: 'type', label: '구분' },
          { key: 'releaseDate', label: '출고일', _style: 'width: 100px;' },
          { key: 'products', label: '품번' },
          { key: 'btnDetail', label: '상세' }
        ]
      }
    }
  },
  methods: {
    getOrderTypeConvert (type) {
      if (type === 1) {
        return {
          lable: '매장',
          style: 'background-color: #ccc;'
        }
      } else if (type === 2) {
        return {
          lable: '네이버',
          style: 'background-color: #19CE60; color: white;'
        }
      } else if (type === 3) {
        return {
          lable: '롯데',
          style: 'background-color: #E30613; color: white;'
        }
      } else {
        return {
          lable: '',
          style: ''
        }
      }
    },
    goOrderDetail (id) {
      this.$router.push({ path: `/orders/${id}` })
    }
  },
  async mounted () {
    /*
      - 최근 미완료 TodoList 5
      - 주문장 미출고 목록 10개 노출(오래된 순서대로)
      - 최근 일정 5개
      - ** 리스트 하나 더 **
      - 최근 30일간 수평이동 개수
      - 최근 30일간 주문장 상품 개수
    */
    let todosFind = await this.$db.todos.find({ isCompleted: false }, { createDate: 1 }, 0, 5)
    if (todosFind.isSuccess) {
      this.todo.rows = todosFind.result
    }

    let schedulesFind = await this.$db.schedules.find({ endDate: { $gte: new Date() } }, { endDate: 1 }, 0, 5)
    if (schedulesFind.isSuccess) {
      this.schedule.rows = schedulesFind.result
    }

    let ordersFind = await this.$db.orders.find({ deliveryNo: '' }, { createDate: 1 }, 0, 10)
    if (ordersFind.isSuccess) {
      this.order.rows = ordersFind.result
    }

    let tradesFind = await this.$db.trades.findByQuery({
      createDate: { $gte: this.$moment().add(-30, 'd')._d }
    })
    if (tradesFind.isSuccess) {
      let tradesSum = tradesFind.result.reduce((sum, trade) => {
        return sum + Number(trade.amount || 0)
      }, 0)

      console.log(tradesSum)
    }

    let ordersSumFind = await this.$db.orders.findByQuery({
      createDate: { $gte: this.$moment().add(-30, 'd')._d }
    })
    if (ordersSumFind.isSuccess) {
      let ordersSum = ordersSumFind.result.reduce((sum, order) => {
        return sum + order.products.reduce((sumProduct, product) => {
          return sumProduct + Number(product.amount || 0)
        }, 0)
      }, 0)

      console.log(ordersSum)
    }
  }
}
</script>

<style>

</style>