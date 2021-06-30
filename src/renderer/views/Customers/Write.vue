<template>
<div>
  <CCard>
    <CCardHeader>
      <strong>고객 관리</strong> 생성
    </CCardHeader>
    <CCardBody>
      <CForm>
        <CInput
          description="고객의 이름을 입력해 주세요."
          label="이름"
          horizontal
          autocomplete="name"
          ref="name"
          v-model="customer.name"
          @keyup.enter="add"
        />
        <CInput
          label="연락처"
          description="고객의 연락처를 입력해 주세요."
          horizontal
          ref="contact"
          v-model="customer.contact"
          @keyup.enter="add"
        />
        <CInput
          label="주소"
          description="주소를 입력해 주세요."
          horizontal
          ref="address"
          v-model="customer.address"
          @keyup.enter="add"
        />
        <CRow form class="form-group">
          <CCol tag="label" sm="3" class="col-form-label">
            행사알림
          </CCol>
          <CCol sm="9">
            <CSwitch
              class="mr-1"
              color="primary"
              :checked.sync="customer.isEventAlarm"
              @keyup.enter="add"
            />
          </CCol>
        </CRow>
        <CInput
          label="설명"
          horizontal
          ref="description"
          v-model="customer.description"
          @keyup.enter="add"
        />
      </CForm>
    </CCardBody>
    <CCardFooter>
      <CButton type="submit" size="sm" color="primary" @click="add()"><CIcon name="cil-check-circle"/> 생성</CButton>
      <CButton type="button" size="sm" color="danger" @click="goList()"><CIcon name="cil-ban"/> 취소</CButton>
    </CCardFooter>
  </CCard>
</div>
</template>

<script>
export default {
  name: 'customers-write',
  data () {
    return {
      customer: this.$db.customers.getNewDocument()
    }
  },
  methods: {
    async add () {
      let db = this.$db.customers
      let insert = await db.insert(this.customer) // insert
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('고객 생성에 실패하였습니다.')
        return
      }

      alert('생성되었습니다.')
      this.goList()
    },
    goList () {
      this.$router.push({ path: '/customers' })
    }
  },
  mounted () {
    this.$utils.getElement(this, 'name').focus()
  }
}
</script>

<style>

</style>