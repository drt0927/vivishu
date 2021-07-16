<template>
    <div>
    <CCard>
      <CCardHeader>
        <strong>지점 관리</strong> {{id ? '수정' : '추가'}}
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            description="지점명을 입력해 주세요."
            label="지점명"
            horizontal
            autocomplete="name"
            ref="name"
            v-model="store.name"
            @keyup.enter="excute"
          />
          <CInput
            label="연락처"
            description="연락처를 입력해 주세요."
            horizontal
            ref="contact"
            v-model="store.contact"
            @keyup.enter="excute"
          />
          <CInput
            label="배송코드"
            description="배송코드를 입력해 주세요."
            horizontal
            ref="deliveryCode"
            v-model="store.deliveryCode"
            @keyup.enter="excute"
          />
          <CInput
            label="매니저"
            horizontal
            ref="owner"
            v-model="store.owner"
            @keyup.enter="excute"
          />
          <CInput
            label="메모"
            horizontal
            ref="description"
            v-model="store.description"
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
export default {
  name: 'stores-write',
  data () {
    return {
      id: this.$route.params.id,
      db: this.$db.stores,
      store: this.$db.stores.getDocument()
    }
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

      let add = await this.db.add(this.store) // insert
      if (!add.isSuccess) {
        console.log(add.result)
        alert('지점 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '지점 정보 추가 완료', 'success')

      this.goList()
    },
    async modify () {
      if (!this.valid()) {
        return
      }

      let update = await this.db.update(this.store)
      if (!update.isSuccess) {
        alert('지점 정보 수정을 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '지점 정보 수정 완료', 'success')

      this.goList()
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/stores/${this.id}` })
      } else {
        this.$router.push({ path: '/stores' })
      }
    },
    valid () {
      if (!this.store.name) {
        alert(`[지점명]은(는) 필수 값 입니다.`)
        this.$utils.common.getElement(this, 'name').focus()
        return false
      }

      if (!this.$utils.check.call(this.store.contact)) {
        alert('[연락처] 형식이 올바르지 않습니다. 숫자 10~11자리 입니다.')
        this.$utils.common.getElement(this, 'contact').focus()
        return false
      }

      return true
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'name').focus()

    if (this.id) {
      let find = await this.db.findOne(this.id)
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.store = find.result
    }
  }
}
</script>

<style>

</style>