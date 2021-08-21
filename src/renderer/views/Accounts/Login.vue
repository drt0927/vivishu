<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>로그인</h1>
                  <p class="text-muted">비비슈 계정 로그인</p>
                  <CInput
                    placeholder="아이디를 입력해 주세요."
                    autocomplete="id"
                    ref="id"
                    v-model="account.id"
                    @keyup.enter="tryLogin"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="비밀번호를 입력해 주세요."
                    type="password"
                    autocomplete="curent-password"
                    v-model="account.pwd"
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
      db: this.$db.accounts,
      account: this.$db.accounts.getDocument({ id: '' })
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
      if (!this.valid()) {
        return
      }

      let find = await this.db.findOneByQuery({ id: this.account.id, pwd: this.$utils.crypt.encryptSHA512(this.account.pwd) })
      console.log(find)
      if (!find.isSuccess) {
        this.logout()
        alert(find.result)
        return
      }

      if (!find.result) {
        this.$utils.sweetAlert.showToast(this, '로그인에 실패하였습니다.\r\n\r\n아이디 혹은 비밀번호를 확인해주세요.', 'error')
      }

      this.login({
        id: find.result.id,
        name: find.result.name
      })

      this.goMain()
    },
    valid () {
      if (!this.account.id) {
        alert(`[아이디]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'id').focus()
        return false
      }

      if (!this.account.pwd) {
        alert(`[비밀번호]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'pwd').focus()
        return false
      }

      return true
    },
    goMain () {
      this.$router.push({ path: '/' })
    }
  },
  async mounted () {
    if (this.isLogin) {
      this.goMain()
    }

    let count = await this.db.count({})
    if (count.result < 1) {
      this.$router.push({ path: '/register' })
    }

    this.$utils.common.getElement(this, 'id').focus()
  }
}
</script>

<style>

</style>