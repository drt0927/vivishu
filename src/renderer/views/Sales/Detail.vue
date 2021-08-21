<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>일매출 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="매출일"
          horizontal
          disabled
          v-bind:value="$moment(sales.salesDate).format('YYYY-MM-DD(dd)')"
        />
        <CInput
          label="비비안"
          horizontal
          disabled
          v-bind:value="sales.vivian.toLocaleString('ko-KR')"
        />
        <CInput
          label="비너스"
          horizontal
          disabled
          v-bind:value="sales.venus.toLocaleString('ko-KR')"
        />
        <CInput
          label="코데즈"
          horizontal
          disabled
          v-bind:value="sales.codes.toLocaleString('ko-KR')"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(sales.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol>
            <CButton type="submit" size="sm" color="primary" @click="goWrite">수정</CButton>
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
  name: 'sales-detail',
  data () {
    return {
      id: this.$route.params.id,
      sales: {}
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/sales' })
    },
    goWrite () {
      this.$router.push({ path: `/sales/Write/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.sales.remove(this.id)
        if (!remove.isSuccess) {
          alert('일매출 정보를 삭제하지 못했습니다.')
          return
        }

        this.$utils.sweetAlert.showToast(this, '일매출 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.sales.findOne(this.id)
    if (!find.isSuccess) {
      alert(find.result)
      this.goIndex()
    }

    this.sales = find.result
  }
}
</script>

<style>

</style>