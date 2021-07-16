<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>고객 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="이름"
          horizontal
          disabled
          v-bind:value="customer.name"
        />
        <CInput
          label="연락처"
          horizontal
          disabled
          v-bind:value="contact"
        >
          <template #append>
            <CButton type="button" color="info" @click="authCheck(actionCodes.CONTACT_READ)">확인</CButton>
          </template>
        </CInput>
        <CInput
          label="주소"
          horizontal
          disabled
          v-bind:value="customer.address"
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
              :checked="customer.isEventAlarm"
            />
          </CCol>
        </CRow>
        <CInput
          label="메모"
          horizontal
          disabled
          v-bind:value="customer.description"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(customer.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol>
            <CButton type="submit" size="sm" color="primary" @click="authCheck(actionCodes.DOCUMENT_UPDATE)">수정</CButton>
            <CButton type="button" size="sm" color="info" @click="goOrderWrite">주문장 추가</CButton>
          </CCol>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" class="float-right" @click="goIndex">목록</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>

    <CModal
      title="접근권한 확인"
      color="info"
      :show.sync="modal.show"
    >
    <CRow>
      <CCol>
        <CInput
          label="계정 비밀번호"
          placeholder="비밀번호를 입력해주세요."
          ref="pwd"
          type="password"
          v-model="modal.pwd"
          @keydown.enter="modalCompleted"
        />
      </CCol>
    </CRow>
    <template #footer>
      <CButton @click="modalCompleted" color="success">확인</CButton>
      <CButton @click="modal.show = false" color="danger">취소</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'customers-detail',
  data () {
    return {
      id: this.$route.params.id,
      customer: {},
      actionCodes: {
        CONTACT_READ: 1,
        DOCUMENT_UPDATE: 2
      },
      modal: {
        show: false,
        confirmPwd: false,
        actionCode: 0,
        pwd: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      accountId: 'Auth/id'
    }),
    contact () {
      return this.modal.confirmPwd && this.modal.actionCode === this.actionCodes.CONTACT_READ ? this.customer.contact : this.$utils.masking.phone(this.customer.contact)
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/customers' })
    },
    goOrderWrite () {
      this.$router.push({ path: `/orders/write?customerId=${this.id}&name=${this.customer.name}` })
    },
    goCustomerWrite () {
      this.$router.push({ path: `/customers/Write/${this.id}` })
    },
    authCheck (actionCode) {
      this.modal.actionCode = actionCode
      if (!this.modal.confirmPwd) {
        this.modal.show = true
        return
      }

      if (this.modal.actionCode === this.actionCodes.DOCUMENT_UPDATE) {
        this.goCustomerWrite()
      }
    },
    async modalCompleted () {
      if (!this.modal.pwd) {
        alert(`[비밀번호]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'pwd').focus()
        return false
      }

      let find = await this.$db.accounts.findOneByQuery({ id: this.accountId, pwd: this.$utils.crypt.encryptSHA512(this.modal.pwd) })
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.modal.confirmPwd = true
      this.modal.show = false

      if (this.modal.actionCode === this.actionCodes.DOCUMENT_UPDATE) {
        this.goCustomerWrite()
      }
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.customers.remove(this.id)
        if (!remove.isSuccess) {
          alert('고객 정보를 삭제하지 못했습니다.')
          return
        }

        this.$utils.sweetAlert.showToast(this, '고객 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.customers.findOne(this.id)
    if (!find.isSuccess) {
      alert(find.result)
      this.goIndex()
    }

    this.customer = find.result
  }
}
</script>

<style>

</style>