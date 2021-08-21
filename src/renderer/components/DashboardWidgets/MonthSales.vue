<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>{{$moment(new Date()).format('MM')}}월 총 매출</strong>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol lg="4">
            <simple-bar-chart-widget
              color="warning"
              :header="monthTotal.vivianSum.toLocaleString('ko-KR') + ' 원'"
              text="비비안 월매출"
              :data="monthTotal.vivianSales"
              label="비비안"
              backgroundColor="rgba(0,0,0,.2)"
              :barPercentage="0.5"
              :categoryPercentage="1"
              :height="60"
            />
          </CCol>
          <CCol lg="4">
            <simple-bar-chart-widget
              color="success"
              :header="monthTotal.venusSum.toLocaleString('ko-KR') + ' 원'"
              text="비너스 월매출"
              :data="monthTotal.venusSales"
              label="비너스"
              backgroundColor="rgba(0,0,0,.2)"
              :barPercentage="0.5"
              :categoryPercentage="1"
              :height="60"
            />
          </CCol>
          <CCol lg="4">
            <simple-bar-chart-widget
              color="info"
              :header="monthTotal.codesSum.toLocaleString('ko-KR') + ' 원'"
              text="코데즈 월매출"
              :data="monthTotal.codesSales"
              label="코데즈"
              backgroundColor="rgba(0,0,0,.2)"
              :barPercentage="0.5"
              :categoryPercentage="1"
              :height="60"
            />
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <strong>{{$moment(new Date()).format('MM')}}월 매출 비교</strong> <small>(전월대비)</small>
      </CCardHeader>
      <CCardBody>
        <CChartLine
          :datasets="amountCompareChart.datasets"
          :labels="amountCompareChart.labels"
          :options="amountCompareChart.options"
        />
      </CCardBody>
    </CCard>
  </div>
</template>

<script>
import SimpleBarChartWidget from '../../components/Controls/SimpleBarChartWidget.vue'
import { CChartLine } from '@coreui/vue-chartjs'

export default {
  name: 'MonthSales',
  data () {
    return {
      monthTotal: {
        vivianSales: [],
        vivianSum: 0,
        venusSales: [],
        venusSum: 0,
        codesSales: [],
        codesSum: 0
      },
      amountCompareChart: {
        labels: [],
        options: {
          legend: {
            position: 'bottom'
          }
        },
        datasets: [{
          label: '이번달',
          data: [],
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1
        }, {
          label: '지난달',
          data: [],
          fill: false,
          borderColor: 'rgb(54, 162, 235)',
          tension: 0.1
        }]
      }
    }
  },
  components: {
    SimpleBarChartWidget,
    CChartLine
  },
  async mounted () {
    let month = await this.$db.sales.getStatMonth()
    this.monthTotal = month

    // 전월대비(비용, 일자별) line chart
    let compare = await this.$db.sales.getCompareSales()
    console.log(compare)
    this.amountCompareChart.labels = compare.labels
    this.amountCompareChart.datasets[0].data = compare.data.current
    this.amountCompareChart.datasets[1].data = compare.data.last
  }
}
</script>

<style>

</style>