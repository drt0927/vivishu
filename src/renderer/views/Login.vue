<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                    v-model="id"
                    @keyup.enter="tryLogin"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                    v-model="pwd"
                    ref="pwd"
                    @keyup.enter="tryLogin"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="tryLogin">Login</CButton>
                    </CCol>
                    <!-- <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                      <CButton color="link" class="d-lg-none">Register now!</CButton>
                    </CCol> -->
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <!-- <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Sign up</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <CButton
                  color="light"
                  variant="outline"
                  size="lg"
                >
                  Register Now!
                </CButton>
              </CCardBody>
            </CCard> -->
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      id: 'admin',
      pwd: ''
    }
  },
  methods: {
    ...mapActions('Auth', [
      'login',
      'logout'
    ]),
    tryLogin () {
      let vm = this
      let query = {
        id: this.id,
        pwd: this.$utils.encryptSHA512(this.pwd)
      }

      this.$utils.read(this.$db.accounts, query, (err, docs) => {
        if (err || docs.length < 1) {
          vm.logout()
          alert('로그인에 실패하였습니다.')
          return
        }

        vm.login({
          id: docs[0].id,
          name: docs[0].name
        })

        vm.$router.push({ path: '/' })
      })
    }
  },
  mounted () {
    let vm = this

    this.$utils.read(this.$db.accounts, {}, (err, docs) => {
      if (err) {
        alert('계정 정보를 조회하지 못했습니다.')
        return
      }

      if (docs.length < 1) {
        vm.$router.push({ path: '/register' })
        return
      }

      vm.$utils.getElement(this, 'pwd').focus()
    })
  }
}
</script>

<style>

</style>