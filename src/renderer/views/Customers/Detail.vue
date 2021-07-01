<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>고객 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove()">삭제</CButton>
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
          v-bind:value="$utils.masking.phone(customer.contact)"
        >
          <template #append>
            <CButton type="button" color="info" @click="contactRead()">확인</CButton>
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
          label="설명"
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
            <CButton type="submit" size="sm" color="primary" @click="goEdit(id)">수정</CButton>
          </CCol>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" class="float-right" @click="goIndex()">목록</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'customers-detail',
  data () {
    return {
      id: this.$route.params.id,
      customer: this.$db.customers.getNewDocument()
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/customers' })
    },
    goEdit (id) {
      this.$router.push({ path: `/customers/Write/${id}` })
    },
    contactRead () {

    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.customers.remove(this.id)
        if (!remove.isSuccess) {
          alert('고객정보를 삭제하지 못했습니다.')
          return
        }

        this.$swal({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          icon: 'success',
          title: '고객 정보 삭제 완료'
          // text: '고객정보가 삭제되었습니다.'
        })

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.customers.findOne({ _id: this.id })
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.customer = find.result[0]
  }
}
</script>

<style>

</style>