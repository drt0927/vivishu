<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>고객 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="이름"
          horizontal
          disabled
          v-bind:value="customer.name"
        />
        <CInput
          label="연락처"
          horizontal
          disabled
          v-bind:value="customer.contact"
        />
        <CInput
          label="주소"
          horizontal
          disabled
          v-bind:value="customer.address"
        />
        <CRow form class="form-group">
          <CCol tag="label" sm="3" class="col-form-label">
            행사알림
          </CCol>
          <CCol sm="9">
            <CSwitch
              class="mr-1"
              color="primary"
              disabled
              :checked="customer.isEventAlarm"
            />
          </CCol>
        </CRow>
        <CInput
          label="메모"
          horizontal
          disabled
          v-bind:value="customer.description"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(customer.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" @click="goIndex">목록</CButton>
          </CCol>
          <CCol>
            <CButton type="submit" size="sm" color="primary" class="float-right" @click="goCustomerWrite">수정</CButton>
            <CButton type="button" size="sm" color="info" class="float-right" style="margin-right: 10px;" @click="goOrderWrite">주문장 추가</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'customers-detail',
  data () {
    return {
      id: this.$route.params.id,
      customer: {}
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/customers' })
    },
    goOrderWrite () {
      this.$router.push({ path: `/orders/write?customerId=${this.id}&name=${this.customer.name}` })
    },
    goCustomerWrite () {
      this.$router.push({ path: `/customers/Write/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.customers.remove(this.id)
        if (!remove.isSuccess) {
          alert('고객 정보를 삭제하지 못했습니다.')
          return
        }

        this.$utils.sweetAlert.showToast(this, '고객 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.customers.findOne(this.id)
    if (!find.isSuccess) {
      alert(find.result)
      this.goIndex()
    }

    this.customer = find.result
  }
}
</script>

<style>

</style>