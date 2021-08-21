<template>
  <CWidgetDropdown
    :color="color"
    :header="header"
    :text="text"
  >
    <template #footer>
      <CChartBar
        :datasets="datasets"
        :options="options"
        :style="heightString"
      />
    </template>
  </CWidgetDropdown>
</template>

<script>
import { CChartBar } from '@coreui/vue-chartjs'

export default {
  name: 'simple-bar-chart-widget',
  props: {
    color: { type: String },
    header: { type: String },
    text: { type: String },
    data: { type: Array },
    label: { type: String },
    backgroundColor: { type: String },
    pointHoverBackgroundColor: { type: String },
    barPercentage: { type: Number },
    categoryPercentage: { type: Number },
    height: { type: Number }
  },
  computed: {
    heightString: {
      get () {
        return `height:${this.height}px;`
      }
    },
    datasets: {
      get () {
        return [
          {
            data: this.data,
            backgroundColor: this.backgroundColor,
            pointHoverBackgroundColor: this.pointHoverBackgroundColor,
            label: this.label,
            barPercentage: this.barPercentage,
            categoryPercentage: this.categoryPercentage
          }
        ]
      }
    },
    options: {
      get () {
        return {
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: false
            }],
            yAxes: [{
              display: false
            }]
          }
        }
      }
    }
  },
  components: {
    CChartBar
  }
}
</script>

<style>

</style>