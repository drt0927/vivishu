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
      account: this.$db.accounts.getNewDocument({ id: 'admin', name: '김수형', role: 99 })
    }
  },
  methods: {
    async join () {
      let db = this.$db.accounts
      if (!db.validJoin(this, this.account)) {
        return
      }

      let insert = await db.insert(this.account) // insert
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('계정 생성에 실패하였습니다.')
        return
      }

      this.$router.push({ path: '/login' })
    }
  },
  async mounted () {
    let totalCnt = await this.$db.accounts.count()
    if (totalCnt > 0) {
      this.$router.push({ path: '/login' })
    }

    this.$utils.common.getElement(this, 'pwd').focus()
  }
}
</script>

<style>

</style>