<template>
    <div style="min-height:600px;">
    <CCard>
      <CCardHeader>
        <strong>지출 관리</strong> {{id ? '수정' : '추가'}}
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CodeSelect
            label="지출 유형"
            description="지출 유형을 선택해 주세요."
            horizontal
            ref="type"
            :code.sync="expense.type"
            :codeType="codeType"
            @keyup.enter="excute"
          />
          <CInput
            description="지출액을 입력해 주세요."
            label="지출액"
            horizontal
            ref="amount"
            v-model.number="expense.amount"
            type="number"
            @keyup.enter="excute"
          />
          <CInput
            description="내용을 입력해 주세요."
            label="내용"
            horizontal
            ref="description"
            v-model.number="expense.description"
            type="description"
            @keyup.enter="excute"
          />
          <date-picker
            :date.sync="expense.expenseDate"
            horizontal
            ref="expenseDate"
            mask="YYYY-MM-DD"
            placeholder="지출일을 입력해 주세요."
            label="지출일"
            @keyup.enter="excute"
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" @click="excute">{{id ? '수정' : '추가'}}</CButton>
        <CButton type="button" size="sm" color="secondary" class="float-right" @click="goList">취소</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import CodeSelect from '../../components/Controls/CodeSelect.vue'
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'expense-write',
  data () {
    return {
      codeType: '지출유형',
      id: this.$route.params.id,
      db: this.$db.expense,
      expense: this.$db.expense.getDocument()
    }
  },
  components: {
    CodeSelect,
    DatePicker
  },
  methods: {
    async excute () {
      if (this.id) {
        await this.modify()
      } else {
        await this.add()
      }
    },
    async add () {
      if (!this.valid()) {
        return
      }

      let add = await this.db.add(this.expense) // insert
      if (!add.isSuccess) {
        console.log(add.result)
        alert('지출 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '지출 정보 추가 완료', 'success')

      this.goList()
    },
    async modify () {
      if (!this.valid()) {
        return
      }

      let update = await this.db.update(this.expense)
      if (!update.isSuccess) {
        alert('지출 정보 수정을 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '지출 정보 수정 완료', 'success')

      this.goList()
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/expense/${this.id}` })
      } else {
        this.$router.push({ path: '/expense' })
      }
    },
    valid () {
      console.log(this.expense)
      if (!this.expense.type) {
        alert(`[지출 유형]은(는) 필수 값 입니다.`)
        return false
      }

      if (!this.expense.amount) {
        alert('[지출액]은(는) 필수 값 입니다.')
        this.$utils.common.getElement(this, 'amount').focus()
        return false
      }

      if (!this.expense.expenseDate) {
        alert('[지출일]은(는) 필수 값 입니다.')
        this.$utils.common.getElement(this, 'expenseDate').focus()
        return false
      }

      return true
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'amount').focus()

    if (this.id) {
      let find = await this.db.findOne(this.id)
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.expense = find.result
    }
  }
}
</script>

<style>

</style>