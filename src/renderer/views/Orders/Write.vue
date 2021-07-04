<template>
  <div style="min-height:1000px;">
    <CCard>
      <CCardHeader>
        <strong>주문장 관리</strong> {{id ? '수정' : '추가'}}
      </CCardHeader>
      <CCardBody>
        <CForm>
          <CInput
            description="주문자명을 입력해 주세요."
            label="주문자 *"
            horizontal
            ref="name"
            readonly
            v-model="order.name"
            @keyup.enter="excute"
          >
          <template #append>
            <CButton type="button" color="info" @click="modal.customerSearchModalShow = true">검색</CButton>
          </template>
          </CInput>
          <CInput
            label="주소 *"
            description="주소를 입력해 주세요."
            horizontal
            ref="address"
            v-model="order.address"
            @keyup.enter="excute"
          >
            <template #append>
              <CButton type="button" color="info" @click="modal.addressSearchModalShow = true">검색</CButton>
            </template>
          </CInput>
          <CSelect
            label="구분"
            horizontal
            ref="type"
            :value.sync="order.type"
            :options="bind.type"
            @keyup.enter="excute"
          />
          <date-picker
            :date.sync="order.releaseDate"
            horizontal
            ref="releaseDate"
            mask="YYYY-MM-DD"
            placeholder="출고일을 선택해 주세요."
            label="출고일"
            @keyup.enter="excute"
          />
          <CSelect
            label="배송업체"
            horizontal
            ref="deliveryCompany"
            :value.sync="order.deliveryCompany"
            :options="bind.deliveryCompany"
            @keyup.enter="excute"
          />
          <CInput
            label="송장번호"
            horizontal
            ref="deliveryNo"
            v-model="order.deliveryNo"
            @keyup.enter="excute"
          />
          <date-picker
            :date.sync="order.deliveryCompletedDate"
            horizontal
            ref="deliveryCompletedDate"
            mask="YYYY-MM-DD"
            placeholder="배송완료일을 선택해 주세요."
            label="배송완료일"
            @keyup.enter="excute"
          />
          <CInput
            label="메모"
            horizontal
            ref="description"
            v-model="order.description"
            @keyup.enter="excute"
          />
        </CForm>
      </CCardBody>
      <CCardHeader>
        <strong>상품 등록</strong>
        <div class="card-header-actions">
          <CButton type="button" color="success" size="sm" @click="addProduct">
            <CIcon name="cil-plus" />
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody style="padding: 0;">
        <CDataTable
          :items="order.products"
          :fields="productsFields"
          hover
          >
          <template #no="{item}">
            <td>
              <CInput type="text" autocomplete="no" ref="no" v-model="item.no"/>
            </td>
          </template>
          <template #amount="{item}">
            <td>
              <CInput type="number" v-model="item.amount" @keyup.shift.enter="addProduct" @keyup.ctrl.enter="excute" />
            </td>
          </template>
          <template #description="{item}">
            <td>
              <CInput type="text" v-model="item.description" @keyup.shift.enter="addProduct" @keyup.ctrl.enter="excute" />
            </td>
          </template>
          <template #btnRemove="{index}">
            <td>
              <CButton
                color="secondary"
                size="sm"
                @click="removeProduct(index)"
              >
                <CIcon name="cil-minus"/>
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
      <CCardFooter>
        <CButton type="submit" size="sm" color="primary" @click="excute">{{id ? '수정' : '추가'}}</CButton>
        <CButton type="button" size="sm" color="secondary" class="float-right" @click="goList">취소</CButton>
      </CCardFooter>
    </CCard>
    <address-search-modal :show.sync="modal.addressSearchModalShow" @complete="addressSearchComplete"/>
    <customer-search-modal :show.sync="modal.customerSearchModalShow" @selected="customerSearchSelected"/>
  </div>
</template>

<script>
import AddressSearchModal from '../../components/Modals/AddressSearchModal.vue'
import CustomerSearchModal from '../../components/Modals/CustomerSearchModal.vue'
import DatePicker from '../../components/Controls/DatePicker.vue'

export default {
  name: 'orders-write',
  data () {
    return {
      id: this.$route.params.id,
      db: this.$db.orders,
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
      modal: {
        addressSearchModalShow: false,
        customerSearchModalShow: false
      },
      order: this.$db.orders.getNewDocument(),
      productsFields: [
        { key: 'no', label: '품번' },
        { key: 'amount', label: '수량' },
        { key: 'description', label: '메모' },
        { key: 'btnRemove', label: '' }
      ]
    }
  },
  components: {
    AddressSearchModal,
    CustomerSearchModal,
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
      if (!this.db.valid(this, this.order)) {
        return
      }

      let insert = await this.db.insert(this.order) // insert
      if (!insert.isSuccess) {
        console.log(insert.result)
        alert('주문장 정보 추가를 실패하였습니다.')
        return
      }

      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: '주문장 정보 추가 완료'
      })

      this.goList()
    },
    async modify () {
      if (!this.db.valid(this, this.order)) {
        return
      }

      let update = await this.db.update(this.id, this.order)
      if (!update.isSuccess) {
        alert('주문장 정보 수정을 실패하였습니다.')
        return
      }

      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: '주문장 정보 수정 완료'
      })

      this.goList()
    },
    addProduct () {
      this.order.products.push(this.$db.orders.getProductDocument())
      setTimeout(() => {
        this.$utils.common.getElement(this, 'no').focus()
        this.productIdReset()
      }, 0)
    },
    removeProduct (index) {
      this.order.products.splice(index, 1)
      this.productIdReset()
    },
    productIdReset () {
      this.order.products.forEach((product, index) => {
        product._id = index
      })
    },
    goList () {
      if (this.id) {
        this.$router.push({ path: `/orders/${this.id}` })
      } else {
        this.$router.push({ path: '/orders' })
      }
    },
    addressSearchComplete (addr) {
      this.order.address = addr
    },
    customerSearchSelected (id, name) {
      this.order.customerId = id
      this.order.name = name
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

      this.order = find.result[0]
    }
  }
}
</script>

<style>

</style>