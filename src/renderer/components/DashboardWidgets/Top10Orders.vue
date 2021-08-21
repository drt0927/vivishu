<template>
  <CCard>
    <CCardHeader>
      <strong>주문장</strong> <small>미출고 목록 (오래된순)</small>
    </CCardHeader>
    <CDataTable
      class="mb-0 table-outline"
      hover
      :items="rows"
      :fields="fields"
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
            <ul class="products-list" v-c-tooltip="{content: (item.description || ' ')}">
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
  </CCard>
</template>

<script>
export default {
  name: 'Top10Orders',
  data () {
    return {
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
    // 주문장 미출고 목록 10개 노출(오래된 순서대로)
    let ordersFind = await this.$db.orders.find({ deliveryNo: '' }, { createDate: 1 }, 0, 10)
    if (ordersFind.isSuccess) {
      this.rows = ordersFind.result
    }
  }
}
</script>

<style>

</style>