<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>지출 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CodeSelect
          label="지출 유형"
          codeType="지출유형"
          horizontal
          disabled
          :code="expense.type"
        />
        <CInput
          label="지출액"
          horizontal
          disabled
          v-bind:value="expense.amount"
        />
        <CInput
          label="내용"
          horizontal
          disabled
          v-bind:value="expense.description"
        />
        <CInput
          label="지출일"
          horizontal
          disabled
          v-bind:value="$moment(expense.expenseDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(expense.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol col="2">
            <CButton type="submit" size="sm" color="secondary" @click="goIndex">목록</CButton>
          </CCol>
          <CCol>
            <CButton type="submit" size="sm" color="primary" class="float-right" @click="goEdit">수정</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import CodeSelect from '../../components/Controls/CodeSelect.vue'

export default {
  name: 'expense-detail',
  data () {
    return {
      id: this.$route.params.id,
      expense: {}
    }
  },
  components: {
    CodeSelect
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/expense' })
    },
    goEdit () {
      this.$router.push({ path: `/expense/Write/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.expense.remove(this.id)
        if (!remove.isSuccess) {
          alert('지출 정보를 삭제하지 못했습니다.')
          return
        }

        this.$utils.sweetAlert.showToast(this, '지출 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.expense.findOne(this.id)
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }

    this.expense = find.result
  }
}
</script>

<style>

</style>