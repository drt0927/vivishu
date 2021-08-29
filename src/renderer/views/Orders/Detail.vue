<template>
  <div>
    <CCard>
      <CCardHeader>
        <strong>주문장 관리</strong> 상세
        <div class="card-header-actions">
          <CButton type="button" size="sm" color="danger" @click="remove">삭제</CButton>
        </div>
      </CCardHeader>
      <CCardBody>
        <CInput
          label="주문자 *"
          horizontal
          disabled
          v-model="order.name"
        />
        <CInput
          label="연락처"
          horizontal
          disabled
          v-model="customer.contact"
        />
        <CInput
          label="주소 *"
          horizontal
          disabled
          v-model="order.address"
        />
        <CSelect
          label="구분"
          horizontal
          disabled
          :value="order.type"
          :options="bind.type"
        />
        <date-picker
          :date="order.releaseDate"
          horizontal
          disabled
          mask="YYYY-MM-DD"
          label="출고일" />
        <CSelect
          label="배송업체"
          horizontal
          disabled
          :value="order.deliveryCompany"
          :options="bind.deliveryCompany"
        />
        <CInput
          label="송장번호"
          horizontal
          disabled
          v-model="order.deliveryNo"
        />
        <date-picker
          :date="order.deliveryCompletedDate"
          horizontal
          disabled
          mask="YYYY-MM-DD"
          label="배송완료일" />
        <CInput
          label="메모"
          horizontal
          disabled
          v-model="order.description"
        />
        <CInput
          label="생성일"
          horizontal
          disabled
          v-bind:value="$moment(order.createDate).format('YYYY-MM-DD(dd) HH:mm:ss')"
        />
      </CCardBody>
      <CCardHeader>
        <strong>상품 목록</strong>
      </CCardHeader>
      <CCardBody style="padding: 0;">
        <CDataTable
          :items="order.products"
          :fields="productsFields"
          hover
          >
          <template #no="{item}">
            <td>
              <CInput type="text" disabled v-model="item.no" />
            </td>
          </template>
          <template #amount="{item}">
            <td>
              <CInput type="number" disabled v-model="item.amount" />
            </td>
          </template>
          <template #description="{item}">
            <td>
              <CInput type="text" disabled v-model="item.description" />
            </td>
          </template>
        </CDataTable>
      </CCardBody>
      <CCardFooter>
        <CRow>
          <CCol>
            <CButton type="submit" size="sm" color="secondary" @click="goIndex">목록</CButton>
          </CCol>
          <CCol col="2">
            <CButton type="submit" size="sm" color="primary" class="float-right" @click="goWrite">수정</CButton>
          </CCol>
        </CRow>
      </CCardFooter>
    </CCard>
  </div>
</template>

<script>
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'orders-detail',
  components: {
    DatePicker
  },
  data () {
    return {
      id: this.$route.params.id,
      bind: {
        type: [
          { value: 1, label: '매장' },
          { value: 2, label: '네이버' },
          { value: 3, label: '롯데' }
        ],
        deliveryCompany: [
          { value: 0, label: '기타' },
          { value: 1, label: '롯데' },
          { value: 2, label: '로젠' }
        ]
      },
      order: {},
      customer: {},
      productsFields: [
        { key: 'no', label: '품번' },
        { key: 'amount', label: '수량' },
        { key: 'description', label: '메모' }
      ]
    }
  },
  methods: {
    goIndex () {
      this.$router.push({ path: '/orders' })
    },
    goWrite () {
      this.$router.push({ path: `/orders/write/${this.id}` })
    },
    async remove () {
      if (confirm('삭제하시겠습니까?')) {
        let remove = await this.$db.orders.remove(this.id)
        if (!remove.isSuccess) {
          alert('주문장 정보를 삭제하지 못했습니다.')
          return
        }

        this.$utils.sweetAlert.showToast(this, '주문장 정보 삭제 완료', 'success')

        this.goIndex()
      }
    }
  },
  async mounted () {
    let find = await this.$db.orders.findOne(this.id)
    if (!find.isSuccess) {
      alert('상세 내용을 찾을 수 없습니다.')
      this.goIndex()
    }
    this.order = find.result

    let customerFind = await this.$db.customers.findOne(this.order.customerId)
    if (!find.isSuccess) {
      console.log('고객 정보를 찾을 수 없습니다.')
    }
    this.customer = customerFind.result
  }
}
</script>

<style>

</style>