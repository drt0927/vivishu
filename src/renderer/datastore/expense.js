import NedbHelper from './nedbHelper'
import moment from 'moment'
import codes from './codes'
import utils from '../utils/utils'

class Expense extends NedbHelper {
  constructor () {
    super('expense.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      type: '',
      amount: 0,
      description: '',
      expenseDate: new Date()
    }, defaultObject)
  }

  // 이번달 지출 유형 비율
  async getCurrentMonthTypeRate () {
    // 이번달 지출 정보 조회
    let expenseFind = await this.findByQuery({
      expenseDate: {
        $gte: moment().startOf('month').toDate(),
        $lte: moment().endOf('month').toDate()
      }
    })

    // 조회 실패시 빈 배열 반환
    if (!expenseFind.isSuccess) {
      return {
        data: [],
        labels: [],
        colors: []
      }
    }
    let expenseDatas = expenseFind.result
    let expenseTypes = await codes.getCodeList('지출유형')

    expenseDatas.forEach((r) => {
      let code = expenseTypes.find((e) => Number(e.code) === Number(r.type))
      r.typeName = code.name
      r.typeColor = code.color
    })

    // type별 합계
    let data = {}
    let colors = []
    expenseDatas.reduce((sumObj, expense) => {
      if (!data[expense.typeName]) {
        data[expense.typeName] = 0
        colors.push(utils.common.Hex8toRgba(expense.typeColor))
      }
      data[expense.typeName] += expense.amount
      return sumObj
    }, {})

    return {
      data: Object.values(data),
      labels: Object.keys(data),
      colors: colors
    }
  }

  // 이번달, 지난달 지출 유형 비교
  async getTypeCompare () {
    // 이번달 지출 정보 조회
    let expenseFind = await this.findByQuery({
      expenseDate: {
        $gte: moment().add(-1, 'month').startOf('month').toDate(),
        $lte: moment().endOf('month').toDate()
      }
    })

    if (!expenseFind.isSuccess) {
      return {
        data: [],
        labels: [],
        colors: []
      }
    }

    let expenseDatas = expenseFind.result
    let expenseTypes = await codes.getCodeList('지출유형')

    expenseDatas.forEach((r) => {
      let code = expenseTypes.find((e) => Number(e.code) === Number(r.type))
      r.typeName = code.name
      r.typeColor = code.color
    })

    let labels = []
    expenseDatas.forEach((e) => {
      if (labels.indexOf(e.typeName) < 0) {
        labels.push(e.typeName)
      }
    })

    let data = {
      currentData: {},
      lastData: {}
    }

    labels.forEach((e) => {
      expenseDatas.filter((d) => d.typeName === e).forEach((d) => {
        if (!data.currentData[e]) {
          data.currentData[e] = 0
        }
        if (!data.lastData[e]) {
          data.lastData[e] = 0
        }

        // 이번달
        if (d.expenseDate >= moment().startOf('month').toDate() && d.expenseDate <= moment().endOf('month').toDate()) {
          data.currentData[e] += d.amount
        }
        // 지난달
        if (d.expenseDate >= moment().add(-1, 'month').startOf('month').toDate() && d.expenseDate <= moment().add(-1, 'month').endOf('month').toDate()) {
          data.lastData[e] += d.amount
        }
      })
    })

    return {
      data: [
        Object.values(data.currentData),
        Object.values(data.lastData)
      ],
      labels: labels
    }
  }
}

export default (new Expense())
