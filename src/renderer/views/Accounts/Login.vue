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
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'login',
  data () {
    return {
      id: 'admin',
      pwd: ''
    }
  },
  computed: {
    ...mapGetters({
      isLogin: 'Auth/isLogin'
    })
  },
  methods: {
    ...mapActions('Auth', [
      'login',
      'logout'
    ]),
    async tryLogin () {
      let query = {
        id: this.id,
        pwd: this.$utils.encryptSHA512(this.pwd)
      }

      let find = await this.$db.accounts.find(query)
      if (!find.isSuccess) {
        this.logout()
        alert(find.result)
        return
      }

      this.login({
        id: find.result[0].id,
        name: find.result[0].name
      })

      this.$router.push({ path: '/' })
    }
  },
  async mounted () {
    if (this.isLogin) {
      this.$router.push({ path: '/' })
    }

    let totalCnt = await this.$db.accounts.count()
    if (totalCnt < 1) {
      this.$router.push({ path: '/register' })
    }

    this.$utils.getElement(this, 'pwd').focus()
  }
}
</script>

<style>

</style>