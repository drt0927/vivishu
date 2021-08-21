<template>
  <div>
    <CRow>
      <CCol sm="12" lg="6">
        <!-- 지출유형 Pie Chart -->
        <CCard>
          <CCardHeader>
            <strong>{{$moment(new Date()).format('MM')}}월 지출 유형 비율</strong>
          </CCardHeader>
          <CCardBody>
            <CChartDoughnut
              :datasets="typeRateChart.datasets"
              :labels="typeRateChart.labels"
              :options="typeRateChart.options"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol sm="12" lg="6">
        <!-- 지출유형 전월대비 Radar Chart -->
        <CCard>
          <CCardHeader>
            <strong>{{$moment(new Date()).format('MM')}}월 지출 유형 비교</strong> <small>(전월대비)</small>
          </CCardHeader>
          <CCardBody>
            <CChartRadar
              :datasets="typeCompareChart.datasets"
              :labels="typeCompareChart.labels"
              :options="typeCompareChart.options"
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
import { CChartDoughnut, CChartRadar } from '@coreui/vue-chartjs'

export default {
  name: 'ExpenseStat',
  data () {
    return {
      typeRateChart: {
        labels: [],
        datasets: [{
          label: '지출 유형',
          data: [],
          backgroundColor: [],
          hoverOffset: 4
        }],
        options: {
          legend: {
            position: 'right'
          },
          tooltips: {
            callbacks: {
              label: function (context, data) {
                let amount = data.datasets[context.datasetIndex].data[context.index]
                let label = data.labels[context.index]
                return `[${label}]   ${amount.toLocaleString('ko-KR')}원`
              }
            }
          }
        }
      },
      typeCompareChart: {
        labels: [],
        options: {
          legend: {
            position: 'right'
          },
          scale: {
            ticks: {
              display: false
            }
          }
        },
        datasets: [{
          label: '이번달',
          data: [],
          fill: true,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgb(255, 99, 132)',
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(255, 99, 132)'
        }, {
          label: '지난달',
          data: [],
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgb(54, 162, 235)',
          pointBackgroundColor: 'rgb(54, 162, 235)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgb(54, 162, 235)'
        }]
      }
    }
  },
  components: {
    CChartDoughnut,
    CChartRadar
  },
  async beforeMount () {
    // 지출유형 pie chart
    let typeRateChartData = await this.$db.expense.getCurrentMonthTypeRate()
    this.typeRateChart.datasets[0].data = typeRateChartData.data
    this.typeRateChart.datasets[0].backgroundColor = typeRateChartData.colors
    this.typeRateChart.labels = typeRateChartData.labels

    // 전월 대비 (지출 유형) Radar Chart
    let typeCompareData = await this.$db.expense.getTypeCompare()
    this.typeCompareChart.labels = typeCompareData.labels
    this.typeCompareChart.datasets[0].data = typeCompareData.data[0]
    this.typeCompareChart.datasets[1].data = typeCompareData.data[1]
  }
}
</script>

<style>

</style>