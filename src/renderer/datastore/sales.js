import NedbHelper from './nedbHelper'
import moment from 'moment'

class Sales extends NedbHelper {
  constructor () {
    super('sales.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      salesDate: new Date(),
      vivian: 0,
      venus: 0,
      codes: 0
    }, defaultObject)
  }

  getDays (month = 0) {
    return new Array(moment().add(month, 'month').daysInMonth()).fill(null).map((x, i) => moment().add(month, 'month').startOf('month').add(i, 'days'))
  }

  async getSalesDays (start, end) {
    let find = await this.find({
      salesDate: {
        $gte: start,
        $lte: end
      }
    }, { salesDate: -1 }, 0, 1000)

    if (!find.isSuccess) {
      return []
    }

    return find.result
  }

  async getStatMonth () {
    let salesDays = await this.getSalesDays(moment().startOf('month').toDate(), moment().endOf('month').toDate())

    return {
      vivianSales: salesDays.map((e) => e.vivian),
      vivianSum: salesDays.reduce((sum, sales) => sum + Number(sales.vivian || 0), 0),
      venusSales: salesDays.map((e) => e.venus),
      venusSum: salesDays.reduce((sum, sales) => sum + Number(sales.venus || 0), 0),
      codesSales: salesDays.map((e) => e.codes),
      codesSum: salesDays.reduce((sum, sales) => sum + Number(sales.codes || 0), 0)
    }
  }

  async getCompareSales () {
    let current = await this.getSalesDays(moment().startOf('month').toDate(), moment().endOf('month').toDate())
    let last = await this.getSalesDays(moment().add(-1, 'month').startOf('month').toDate(), moment().add(-1, 'month').endOf('month').toDate())

    let labels = []
    let data = {
      current: [],
      last: []
    }

    let currentDays = this.getDays()
    currentDays.forEach((m) => {
      labels.push(m.format('MM-DD'))
      let currentDayData = current.filter((c) => moment(c.salesDate).format('MM-DD') === m.format('MM-DD'))
      data.current.push(currentDayData.length > 0 ? currentDayData[0].vivian : 0)
      let lastDayData = last.filter((c) => moment(c.salesDate).format('MM-DD') === m.add(-1, 'month').format('MM-DD'))
      data.last.push(lastDayData.length > 0 ? lastDayData[0].vivian : 0)
    })

    return {
      labels: labels,
      data: data
    }
  }
}

export default (new Sales())
