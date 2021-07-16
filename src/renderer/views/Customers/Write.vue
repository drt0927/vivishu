<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>고객 관리</strong> {{id ? '수정' : '추가'}}
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            description="이름을 입력해 주세요."
            label="이름"
            horizontal
            autocomplete="name"
            ref="name"
            v-model="customer.name"
            @keyup.enter="excute"
          />
          <CInput
            label="연락처"
            description="연락처를 입력해 주세요."
            horizontal
            ref="contact"
            v-model="customer.contact"
            @keyup.enter="excute"
          />
          <CInput
            label="주소"
            description="주소를 입력해 주세요."
            horizontal
            ref="address"
            v-model="customer.address"
            @keyup.enter="excute"
          >
            <template #append>
              <CButton type="button" color="info" @click="modal.show = true">검색</CButton>
            </template>
          </CInput>
          <CRow form class="form-group">
            <CCol tag="label" sm="3" class="col-form-label">
              행사알림
            </CCol>
            <CCol sm="9">
              <CSwitch
                class="mr-1"
                color="primary"
                :checked.sync="customer.isEventAlarm"
                @keyup.enter="excute"
              />
            </CCol>
          </CRow>
          <CInput
            label="메모"
            horizontal
            ref="description"
            v-model="customer.description"
            @keyup.enter="excute"
          />
        </CForm>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" @click="excute">{{id ? '수정' : '추가'}}</CButton>
        <CButton type="button" size="sm" color="secondary" class="float-right" @click="goList">취소</CButton>
      </CCardFooter>
    </CCard>
    <address-search-modal :show.sync="modal.show" @complete="addressSearchComplete"/>
  </div>
</template>

<script>
import AddressSearchModal from '../../components/Modals/AddressSearchModal.vue'

export default {
  name: 'customers-write',
  data () {
    return {
      id: this.$route.params.id,
      db: this.$db.customers,
      customer: this.$db.customers.getNewDocument(),
      modal: {
        show: false
      }
    }
  },
  components: {
    AddressSearchModal
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
      if (!this.db.valid(this, this.customer)) {
        return
      }

      let insert = await this.db.insert(this.customer) // insert
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('고객 정보 추가를 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '고객 정보 추가 완료', 'success')

      this.goList()
    },
    async modify () {
      if (!this.db.valid(this, this.customer)) {
        return
      }

      let update = await this.db.update(this.id, this.customer)
      if (!update.isSuccess) {
        alert('고객 정보 수정을 실패하였습니다.')
        return
      }

      this.$utils.sweetAlert.showToast(this, '고객 정보 수정 완료', 'success')

      this.goList()
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/customers/${this.id}` })
      } else {
        this.$router.push({ path: '/customers' })
      }
    },
    addressSearchComplete (addr) {
      this.customer.address = addr
    }
  },
  async mounted () {
    this.$utils.common.getElement(this, 'name').focus()

    if (this.id) {
      let find = await this.db.findOne({
        _id: {
          operator: this.$utils.enums.NedbQueryOperators.Equal,
          value: this.id
        }
      })
      if (!find.isSuccess) {
        alert(find.result)
        return
      }

      this.customer = find.result[0]
    }
  }
}
</script>

<style>

</style>