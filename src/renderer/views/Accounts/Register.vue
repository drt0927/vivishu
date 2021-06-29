<template>
  <div class="d-flex align-items-center min-vh-100">
    <CContainer fluid>
      <CRow class="justify-content-center">
        <CCol md="6">
          <CCard class="mx-4 mb-0">
            <CCardBody class="p-4">
              <CForm>
                <h1>계정 생성</h1>
                <p class="text-muted">비비슈 계정 생성</p>
                <CInput
                  placeholder="Username"
                  autocomplete="username"
                  v-model="account.id"
                  @keyup.enter="join"
                  disabled
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  ref="pwd"
                  v-model="account.pwd"
                  @keyup.enter="join"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CInput
                  placeholder="Repeat password"
                  type="password"
                  autocomplete="new-password"
                  ref="pwdConfirm"
                  class="mb-4"
                  v-model="account.pwdConfirm"
                  @keyup.enter="join"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block @click="join">계정 생성</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
export default {
  name: 'register',
  data () {
    return {
      account: {
        id: 'admin',
        pwd: '',
        pwdConfirm: '',
        role: 99,
        name: '김수형'
      }
    }
  },
  methods: {
    async join () {
      let db = this.$db.accounts

      let valid = db.valid(this.account)
      if (valid.code !== db.resultCodes.SUCCESS_CODE) {
        alert(valid.msg)
        if (valid.result === db.resultCodes.VALID_EMPTY_PASSWORD) {
          this.$utils.getElement(this, 'pwd').focus()
        } else if (valid.result === db.resultCodes.VALID_CONFIRM) {
          this.$utils.getElement(this, 'pwdConfirm').focus()
        }
        return
      }

      let doc = db.getDocument(this.account) // doc생성
      let insert = await db.insert(doc) // doc insert

      if (!insert.isSuccess) {
        alert(insert.result)
        return
      }

      this.$router.push({ path: '/login' })
    }
  },
  mounted () {
    this.$utils.getElement(this, 'pwd').focus()
  }
}
</script>

<style>

</style>