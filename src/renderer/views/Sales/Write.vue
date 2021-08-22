<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>일매출 관리</strong> {{id ? '수정' : '추가'}}
      </CCardHeader>
      <CCardBody>
        <CForm>
          <date-picker
            placeholder="매출일을 선택해 주세요."
            label="매출일"
            :date.sync="sales.salesDate"
            horizontal
            ref="salesDate"
            mask="YYYY-MM-DD"
            @keyup.enter="excute"
          />
          <CInput
            description="비비안의 매출을 입력해 주세요."
            label="비비안"
            type="number"
            horizontal
            ref="vivian"
            v-model.number="sales.vivian"
            @keyup.enter="excute"
          />
          <CInput
            description="비너스의 매출을 입력해 주세요."
            label="비너스"
            type="number"
            horizontal
            ref="venus"
            v-model.number="sales.venus"
            @keyup.enter="excute"
          />
          <CInput
            description="코데즈의 매출을 입력해 주세요."
            label="코데즈"
            type="number"
            horizontal
            ref="codes"
            v-model.number="sales.codes"
            @keyup.enter="excute"
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="button" size="sm" color="secondary" @click="goList">취소</CButton>
        <CButton type="submit" size="sm" color="primary" class="float-right" @click="excute">{{id ? '수정' : '추가'}}</CButton>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'sales-write',
  data () {
    return {
      id: this.$route.params.id,
      db: this.$db.sales,
      sales: this.$db.sales.getDocument()
    }
  },
  components: {
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
      let add = await this.db.add(this.sales)
      if (!add.isSuccess) {
        alert('일매출 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '일매출 정보 추가 완료', 'success')

      this.goList()
    },
    async modify () {
      if (!this.valid()) {
        return
      }

      let update = await this.db.update(this.sales)
      if (!update.isSuccess) {
        alert('일매출 정보 수정을 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '일매출 정보 수정 완료', 'success')

      this.goList()
    },
    valid () {
      if (!this.sales.salesDate) {
        alert(`[매출일]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'salesDate').focus()
        return false
      }

      if (!this.sales.vivian) {
        alert(`[비비안]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'vivian').focus()
        return false
      }

      return true
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/sales/${this.id}` })
      } else {
        this.$router.push({ path: '/sales' })
      }
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'salesDate').focus()

    if (this.id) {
      let find = await this.db.findOne(this.id)
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.sales = find.result
    }
  }
}
</script>

<style>

</style>