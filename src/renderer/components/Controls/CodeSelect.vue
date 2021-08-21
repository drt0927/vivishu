<template>
  <CSelect
    :description="$vnode.data.attrs.description"
    :placeholder="$vnode.data.attrs.placeholder"
    :label="$vnode.data.attrs.label"
    :horizontal="$vnode.data.attrs.horizontal !== undefined ? true : false"
    :ref="$vnode.data.ref"
    :value.sync="selectedCode"
    :options="options"
    :disabled="$vnode.data.attrs.disabled !== undefined ? true : false"
    @keyup="$listeners.keyup || undefined"
  />
</template>

<script>
export default {
  name: 'CodeSelect',
  data () {
    return {
      options: []
    }
  },
  props: {
    code: { type: String },
    isSelectAll: { type: Boolean, default: false },
    codeType: { type: String }
  },
  computed: {
    selectedCode: {
      get () {
        return this.code
      },
      set (val) {
        this.$emit('update:code', val.toString())
      }
    }
  },
  async mounted () {
    if (!this.codeType) {
      alert('코드 타입을 선언해 주세요.')
      return
    }
    this.options = await this.$db.codes.getSelectCodeList(this.codeType, this.isSelectAll)
    if (!this.code) {
      this.selectedCode = this.options[0].value
    }
  }
}
</script>

<style>

</style>