import NedbHelper from './nedbHelper'
import utils from '../utils/utils'

class Code extends NedbHelper {
  constructor () {
    super('codes.db')
  }

  getDocument (defaultObject) {
    return Object.assign({}, {
      type: '',
      code: 0,
      name: '',
      color: ''
    }, defaultObject)
  }

  getCodeTypeList (isSelectAll = false) {
    let list = [
      { value: '지출유형', label: '지출유형' }
    ]

    if (isSelectAll) {
      list.unshift({ value: '', label: '전체' })
    }

    return list
  }

  async getCodeList (codeType) {
    let find = await this.findByQuery({
      type: codeType
    })

    if (find.isSuccess) {
      return find.result
    }

    return []
  }

  async getSelectCodeList (codeType, isSelectAll = false) {
    console.log()
    var codes = await this.getCodeList(codeType)
    let list = codes.map((e, i) => {
      return {
        value: e.code,
        label: e.name,
        attrs: { style: `background-color: ${utils.common.Hex8toRgba(e.color)}; font-weight: bold;` }
      }
    })

    if (isSelectAll) {
      list.unshift({ value: '', label: '전체', attrs: {} })
    }

    return list
  }
}

export default (new Code())
