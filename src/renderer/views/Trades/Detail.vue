<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>수평이동 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="지점 *"
          horizontal
          disabled
          v-model="trade.name"
        />
        <CSelect
          label="구분"
          horizontal
          disabled
          :value="trade.type"
          :options="bind.type"
        />
        <date-picker
          :date="trade.tradeDate"
          horizontal
          disabled
          mask="YYYY-MM-DD"
          label="거래일" />
        <CInput
          label="품번"
          horizontal
          disabled
          v-model="trade.no"
        />
        <CInput
          label="수량"
          horizontal
          disabled
          v-model="trade.amount"
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
              disabled
              :checked="trade.isConfirm"
            />
          </CCol>
        </CRow>
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(trade.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol>
            <CButton type="submit" size="sm" color="primary" @click="goEdit">수정</CButton>
          </CCol>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" class="float-right" @click="goIndex">목록</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'trades-detail',
  components: {
    DatePicker
  },
  data () {
    return {
      id: this.$route.params.id,
      bind: {
        type: [
          { value: 1, label: '입고' },
          { value: 2, label: '출고' }
        ]
      },
      trade: this.$db.trades.getNewDocument()
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/trades' })
    },
    goEdit () {
      this.$router.push({ path: `/trades/edit/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.trades.remove(this.id)
        if (!remove.isSuccess) {
          alert('수평이동 정보를 삭제하지 못했습니다.')
          return
        }

        this.$swal({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          icon: 'success',
          title: '수평이동 정보 삭제 완료'
        })

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.trades.findOne({
      _id: {
        operator: this.$utils.enums.NedbQueryOperators.Equal,
        value: this.id
      }
    })
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.trade = find.result[0]
    console.log(this.id, this.trade)
  }
}
</script>

<style>

</style>