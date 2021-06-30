<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>고객 관리</strong> 상세
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            label="이름"
            horizontal
            disabled
            v-model="customer.name"
          />
          <CInput
            label="연락처"
            horizontal
            disabled
            v-model="customer.contact"
          />
          <CInput
            label="주소"
            horizontal
            disabled
            v-model="customer.address"
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
                :checked.sync="customer.isEventAlarm"
              />
            </CCol>
          </CRow>
          <CInput
            label="설명"
            horizontal
            disabled
            v-model="customer.description"
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="success" @click="goIndex()">목록</CButton>
        <!-- <CButton type="button" size="sm" color="danger" @click="goList()"><CIcon name="cil-ban"/> 취소</CButton> -->
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
      customer: this.$db.customers.getNewDocument()
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/customers' })
    }
  },
  async mounted () {
    let find = await this.$db.customers.findOne({ _id: this.id })
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.customer = find.result[0]
  }
}
</script>

<style>

</style>