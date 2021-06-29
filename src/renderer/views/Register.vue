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
                  @keyup.enter="joinAccount"
                  disabled
                >
                  <template #prepend-content><CIcon name="cil-user"/></template>
                </CInput>
                <!-- <CInput
                  placeholder="Email"
                  autocomplete="email"
                  prepend="@"
                /> -->
                <CInput
                  placeholder="Password"
                  type="password"
                  autocomplete="new-password"
                  ref="pwd"
                  v-model="account.pwd"
                  @keyup.enter="joinAccount"
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
                  @keyup.enter="joinAccount"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block @click="joinAccount">Create Account</CButton>
              </CForm>
            </CCardBody>
            <!-- <CCardFooter class="p-4">
              <CRow>
                <CCol col="6">
                  <CButton block color="facebook">
                    Facebook
                  </CButton>
                </CCol>
                <CCol col="6">
                  <CButton block color="twitter">
                    Twitter
                  </CButton>
                </CCol>
              </CRow>
            </CCardFooter> -->
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
        pwdConfirm: ''
      },
      salt: 'rnldudnsTnguddl)3(2*1'
    }
  },
  methods: {
    joinAccount () {
      // let vm = this

      console.log(this.$db)
      console.log(this.$db.accounts())

      // if (!this.account.pwd || !this.account.pwdConfirm) {
      //   alert('비밀번호를 입력해주세요')
      //   this.$utils.getElement(this, 'pwd').focus()
      //   return
      // }

      // if (this.account.pwd !== this.account.pwdConfirm) {
      //   alert('비밀번호가 일치하지 않습니다.')
      //   this.$utils.getElement(this, 'pwdConfirm').focus()
      //   return
      // }

      // var account = this.$utils.accountModel.getAccountModel('admin', vm.$utils.encryptSHA512(vm.account.pwd), 99, '김수형')
      // var account = this.$utils.getAccountModel()
      // account.id = 'admin'
      // account.pwd = vm.$utils.encryptSHA512(vm.account.pwd)
      // account.role = 99
      // account.name = '김수형'
      // account.createDate = new Date()

      // this.$utils.insert(this.$db.accounts, account, (err, newDocs) => {
      //   if (err) {
      //     alert('계정생성에 실패하였습니다.')
      //     return
      //   }

      //   vm.$router.push('login')
      // })
    }
  },
  mounted () {
    this.$utils.getElement(this, 'pwd').focus()
  }
}
</script>

<style>

</style>