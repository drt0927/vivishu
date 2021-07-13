<template>
  <div style="min-height:1000px;">
    <CCard>
      <CCardHeader>
        <strong>수평이동 관리</strong> 수정
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
            @keyup.enter="modify"
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
            @keyup.enter="modify"
          />
          <date-picker
            :date.sync="trade.tradeDate"
            horizontal
            ref="tradeDate"
            mask="YYYY-MM-DD"
            placeholder="거래일을 선택해 주세요."
            label="거래일"
            @keyup.enter="modify"
          />
          <CInput
            label="품번"
            horizontal
            ref="no"
            v-model="trade.no"
            @keyup.enter="modify"
          />
          <CInput
            label="수량"
            horizontal
            ref="amount"
            type="number"
            v-model="trade.amount"
            @keyup.enter="modify"
          />
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label">
              확정여부
            </CCol>
            <CCol sm="9">
              <CSwitch
                label="확정"
                class="mr-1"
                color="primary"
                :checked="trade.isConfirm"
              />
            </CCol>
          </CRow>
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" @click="modify">수정</CButton>
        <CButton type="button" size="sm" color="secondary" class="float-right" @click="goDetail">취소</CButton>
      </CCardFooter>
    </CCard>
    <store-search-modal :show.sync="modal.storeSearchModalShow" @selected="storeSearchSelected"/>
  </div>
</template>

<script>
import StoreSearchModal from '../../components/Modals/StoreSearchModal.vue'
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'trades-edit',
  data () {
    return {
      id: this.$route.params.id,
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
    async modify () {
      if (!this.db.validOne(this, this.trade)) {
        return
      }

      let update = await this.db.update(this.id, this.trade)
      if (!update.isSuccess) {
        alert('수평이동 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '수평이동 정보 수정 완료', 'success')

      this.goDetail()
    },
    goDetail () {
      this.$router.push({ path: `/trades/${this.id}` })
    },
    storeSearchSelected (id, name) {
      this.trade.storeId = id
      this.trade.name = name
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'name').focus()

    if (this.id) {
      let find = await this.db.findOne({
        _id: {
          operator: this.$utils.enums.NedbQueryOperators.Equal,
          value: this.id
        }
      })
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.trade = find.result[0]
    }
  }
}
</script>

<style>

</style>