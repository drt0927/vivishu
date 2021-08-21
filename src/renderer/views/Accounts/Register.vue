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
                  :disabled="id !== 'admin'"
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
                  placeholder="Confirm Password"
                  type="password"
                  autocomplete="new-password"
                  ref="pwdConfirm"
                  class="mb-4"
                  v-model="pwdConfirm"
                  @keyup.enter="join"
                >
                  <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                </CInput>
                <CButton color="success" block @click="join">계정 생성</CButton>
                <CButton color="danger" block @click="cancel">취소</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'register',
  data () {
    return {
      db: this.$db.accounts,
      account: this.$db.accounts.getDocument({ id: 'admin', name: '김수형', role: 99 }),
      pwdConfirm: ''
    }
  },
  computed: {
    ...mapGetters({
      id: 'Auth/id',
      isLogin: 'Auth/isLogin'
    })
  },
  methods: {
    async join () {
      let isValid = await this.valid()
      if (!isValid) {
        return
      }

      this.account.pwd = this.$utils.crypt.encryptSHA512(this.account.pwd)
      let add = await this.db.add(this.account)

      if (!add.isSuccess) {
        console.log(add.result)
        alert('계정 생성에 실패하였습니다.')
        return
      }

      this.$router.push({ path: '/login' })
    },
    cancel () {
      this.$router.push({ path: '/login' })
    },
    async valid () {
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

      if (!this.pwdConfirm) {
        alert(`[비밀번호 확인]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'pwdConfirm').focus()
        return false
      }

      if (this.account.pwd !== this.pwdConfirm) {
        alert(`비밀번호가 일치하지 않습니다`)
        return false
      }

      let count = await this.db.count({ id: this.account.id })
      if (count.isSuccess && count.result > 0) {
        alert('동일 계정이 존재합니다.')
        return false
      } else if (!count.isSuccess) {
        alert('계정 생성중 에러가 발생하였습니다.')
        return false
      }

      return true
    }
  },
  async mounted () {
    if (this.id !== 'admin') {
      let count = await this.db.count({})
      if (count.result > 0) {
        this.$router.push({ path: '/login' })
      }

      this.$utils.common.getElement(this, 'pwd').focus()
    } else {
      this.account.id = ''
    }
  }
}
</script>

<style>

</style>