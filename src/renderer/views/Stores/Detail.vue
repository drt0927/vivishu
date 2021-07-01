<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>지점 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="지점명"
          horizontal
          disabled
          v-bind:value="store.name"
        />
        <CInput
          label="연락처"
          horizontal
          disabled
          v-bind:value="store.contact"
         />
        <CInput
          label="배송코드"
          horizontal
          disabled
          v-bind:value="store.deliveryCode"
        />
        <CInput
          label="매니저"
          horizontal
          disabled
          v-bind:value="store.owner"
        />
        <CInput
          label="설명"
          horizontal
          disabled
          v-bind:value="store.description"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(store.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol>
            <CButton type="submit" size="sm" color="primary" @click="goEdit">수정</CButton>
          </CCol>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" class="float-right" @click="goIndex">목록</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
export default {
  name: 'stores-detail',
  data () {
    return {
      id: this.$route.params.id,
      store: this.$db.stores.getNewDocument()
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/stores' })
    },
    goEdit () {
      this.$router.push({ path: `/stores/Write/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.stores.remove(this.id)
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
        })

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.stores.findOne({ _id: this.id })
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.store = find.result[0]
  }
}
</script>

<style>

</style>