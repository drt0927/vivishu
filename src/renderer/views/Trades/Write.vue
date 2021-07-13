<template>
  <div style="min-height:1000px;">
    <CCard>
      <CCardHeader>
        <strong>수평이동 관리</strong> 추가
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            description="지점명을 입력해 주세요."
            label="지점 *"
            horizontal
            ref="name"
            readonly
            v-model="trade.name"
            @keyup.enter="modal.storeSearchModalShow = true"
            @click="modal.storeSearchModalShow = true"
          >
          <template #append>
            <CButton type="button" color="info" @click="modal.storeSearchModalShow = true">검색</CButton>
          </template>
          </CInput>
          <CSelect
            label="구분 *"
            horizontal
            ref="type"
            :value.sync="trade.type"
            :options="bind.type"
            @keyup.enter="excute"
          />
          <date-picker
            :date.sync="trade.tradeDate"
            horizontal
            ref="tradeDate"
            mask="YYYY-MM-DD"
            placeholder="거래일을 선택해 주세요."
            label="거래일"
            @keyup.enter="excute"
          />
        </CForm>
      </CCardBody>
      <CCardHeader>
        <strong>상품 등록</strong>
        <div class="card-header-actions">
          <CButton type="button" color="success" size="sm" @click="addProduct">
            <CIcon name="cil-plus" />
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody style="padding: 0;">
        <CDataTable
          :items="tradeProducts"
          :fields="productsFields"
          hover
          >
          <template #no="{item}">
            <td>
              <CInput type="text" autocomplete="no" ref="no" v-model="item.no"/>
            </td>
          </template>
          <template #amount="{item}">
            <td>
              <CInput type="number" ref="amount" v-model="item.amount" @keyup.shift.enter="addProduct" @keyup.ctrl.enter="excute" />
            </td>
          </template>
          <template #isConfirm="{item}">
            <td>
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="item.isConfirm"
              />
            </td>
          </template>
          <template #btnRemove="{index}">
            <td>
              <CButton
                color="secondary"
                size="sm"
                @click="removeProduct(index)"
              >
                <CIcon name="cil-minus"/>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" @click="add">추가</CButton>
        <CButton type="button" size="sm" color="secondary" class="float-right" @click="goList">취소</CButton>
      </CCardFooter>
    </CCard>
    <store-search-modal :show.sync="modal.storeSearchModalShow" @selected="storeSearchSelected"/>
  </div>
</template>

<script>
import StoreSearchModal from '../../components/Modals/StoreSearchModal.vue'
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'trades-write',
  data () {
    return {
      db: this.$db.trades,
      bind: {
        type: [
          { value: 1, label: '입고' },
          { value: 2, label: '출고' }
        ]
      },
      modal: {
        storeSearchModalShow: false
      },
      trade: this.$db.trades.getNewDocument(),
      tradeProducts: [],
      productsFields: [
        { key: 'no', label: '품번 *' },
        { key: 'amount', label: '수량 *' },
        { key: 'isConfirm', label: '확정' },
        { key: 'btnRemove', label: '' }
      ]
    }
  },
  components: {
    StoreSearchModal,
    DatePicker
  },
  methods: {
    async add () {
      let trades = this.convertTradeModel()
      if (!this.db.validAdd(this, trades)) {
        return
      }

      let insert = await this.db.insertRange(trades)
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('수평이동 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '수평이동 정보 추가 완료', 'success')

      this.goList()
    },
    convertTradeModel () {
      let trades = []
      for (let p of this.tradeProducts) {
        let trade = {
          storeId: this.trade.storeId,
          name: this.trade.name,
          type: this.trade.type,
          tradeDate: this.trade.tradeDate
        }

        trade.no = p.no
        trade.amount = p.amount
        trade.isConfirm = p.isConfirm

        trades.push(trade)
      }
      return trades
    },
    addProduct () {
      this.tradeProducts.push({
        no: '',
        amount: 0,
        isConfirm: false
      })

      setTimeout(() => {
        this.$utils.common.getElement(this, 'no').focus()
      }, 0)
    },
    removeProduct (index) {
      this.tradeProducts.splice(index, 1)
    },
    goList () {
      this.$router.push({ path: '/trades' })
    },
    storeSearchSelected (id, name) {
      this.trade.storeId = id
      this.trade.name = name
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'name').focus()

    if (this.$route.query.storeId) {
      this.trade.storeId = this.$route.query.storeId
      this.trade.name = this.$route.query.name
    }
  }
}
</script>

<style>

</style>