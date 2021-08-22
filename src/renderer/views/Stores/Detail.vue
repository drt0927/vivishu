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
          label="메모"
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
            <CButton type="submit" size="sm" color="secondary" @click="goIndex">목록</CButton>
          </CCol>
          <CCol>
            <CButton type="submit" size="sm" color="primary" class="float-right" @click="goEdit">수정</CButton>
            <CButton type="button" size="sm" color="info" class="float-right" style="margin-right: 10px;" @click="goTradeWrite">수평이동 추가</CButton>
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
      store: {}
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/stores' })
    },
    goTradeWrite () {
      this.$router.push({ path: `/trades/write?storeId=${this.id}&name=${this.store.name}` })
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

        this.$utils.sweetAlert.showToast(this, '고객 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.stores.findOne(this.id)
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.store = find.result
  }
}
</script>

<style>

</style>