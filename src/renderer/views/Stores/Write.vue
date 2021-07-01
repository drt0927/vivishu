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
            label="설명"
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
      store: this.$db.stores.getNewDocument()
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
      if (!this.db.valid(this, this.store)) {
        return
      }

      let insert = await this.db.insert(this.store) // insert
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('지점 정보 추가를 실패하였습니다.')
        return
      }

      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: '지점 정보 추가 완료'
      })

      this.goList()
    },
    async modify () {
      if (!this.db.valid(this, this.store)) {
        return
      }

      let update = await this.db.update(this.id, this.store)
      if (!update.isSuccess) {
        alert('지점 정보 수정을 실패하였습니다.')
        return
      }

      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: '지점 정보 수정 완료'
      })

      this.goList()
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/stores/${this.id}` })
      } else {
        this.$router.push({ path: '/stores' })
      }
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'name').focus()

    if (this.id) {
      let find = await this.db.findOne({ _id: this.id })
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.store = find.result[0]
    }
  }
}
</script>

<style>

</style>