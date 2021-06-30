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
        />
        <CInput
          label="연락처"
          description="고객의 연락처를 입력해 주세요."
          horizontal
          v-model="customer.contact"
        />
        <CInput
          label="주소 1"
          description="주소를 입력해 주세요."
          horizontal
          v-model="customer.address1"
        />
        <CInput
          label="주소 2"
          description="주소를 입력해 주세요."
          horizontal
          v-model="customer.address2"
        />
        <CInput
          label="주소 3"
          description="주소를 입력해 주세요."
          horizontal
          v-model="customer.address3"
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
            />
          </CCol>
        </CRow>
        <CInput
          label="설명"
          horizontal
          v-model="customer.description"
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
      customer: {
        name: '',
        contact: '',
        address1: '',
        address2: '',
        address3: '',
        isEventAlarm: false,
        description: ''
      }
    }
  },
  methods: {
    async add () {
      let db = this.$db.customers
      let doc = db.getDocument(this.customer) // doc생성
      let insert = await db.insert(doc)
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