<template>
  <div style="min-height:1000px;">
    <CCard>
      <CCardHeader>
        <strong>일매출 관리 </strong> <small>목록</small>
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="primary" @click="goWrite">추가</CButton>
        </div>
      </CCardHeader>
      <!-- <CCardBody> -->
      <CDataTable
        :items="table.rows"
        :fields="table.fields"
        :items-per-page="table.perPage"
        hover
      >
        <template #salesDate="{item}">
          <td>
            {{$moment(item.salesDate).format('YYYY-MM-DD')}}
          </td>
        </template>
        <template #vivian="{item}">
          <td>
            {{item.vivian.toLocaleString('ko-KR')}}
          </td>
        </template>
        <template #venus="{item}">
          <td>
            {{item.venus.toLocaleString('ko-KR')}}
          </td>
        </template>
        <template #codes="{item}">
          <td>
            {{item.codes.toLocaleString('ko-KR')}}
          </td>
        </template>
        <template #type="{item}">
          <td>
            <h5><CBadge :style="getTypeConvert(item.type).style" >{{getTypeConvert(item.type).lable}}</CBadge></h5>
          </td>
        </template>
        <template #releaseDate="{item}">
          <td v-c-tooltip="{content: (item.description || ' ')}">
            {{$moment(item.releaseDate).format('YYYY-MM-DD')}}
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
      <!-- </CCardBody> -->
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'sales',
  data () {
    return {
      table: {
        rows: [],
        fields: [
          { key: 'salesDate', label: '매출일' },
          { key: 'vivian', label: '비비안' },
          { key: 'venus', label: '비너스' },
          { key: 'codes', label: '코데즈' },
          { key: 'btnDetail', label: '상세' }
        ],
        sort: {
          salesDate: -1
        },
        currentPage: 1,
        perPage: 30,
        totalPages: 0
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
      await this.$db.sales.findForTable(this.table)
    },
    goWrite () {
      this.$router.push({ path: '/sales/write' })
    },
    goDetail (id) {
      this.$router.push({ path: `/sales/${id}` })
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