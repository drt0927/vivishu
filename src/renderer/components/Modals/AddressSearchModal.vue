<template>
  <CModal title="주소 검색" :show.sync="isShow">
    <VueDaumPostcode style="margin-top:25px;" @complete="addressSearchComplete" />
    <template #footer>
      <div></div>
    </template>
  </CModal>
</template>

<script>
import { VueDaumPostcode } from 'vue-daum-postcode'

export default {
  name: 'address-search-modal',
  props: {
    show: { type: Boolean }
  },
  computed: {
    isShow: {
      get () {
        return this.show
      },
      set (val) {
        this.$emit('update:show', val)
      }
    }
  },
  components: {
    VueDaumPostcode
  },
  methods: {
    addressSearchComplete (addr) {
      let resultAddr = addr.roadAddress
      if (addr.buildingName) {
        resultAddr += ` (${addr.buildingName})`
      }

      this.$emit('complete', resultAddr)
      this.isShow = false
    }
  }
}
</script>

<style>

</style>