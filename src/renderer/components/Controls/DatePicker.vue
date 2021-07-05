<template>
  <v-date-picker
    v-model="selectedDate"
    :attributes="attributes"
    mode="date"
    :masks="{ input: mask }"
    :transition="'none'"
    is-inline
    >
    <template v-slot="{ inputValue, togglePopover }">
      <CInput
        :label="label"
        :placeholder="$vnode.data.attrs.placeholder"
        :horizontal="horizontal"
        :value="inputValue"
        :disabled="disabled"
        :ref="$vnode.data.ref"
        @click="togglePopover({ placement: 'bottom', transition: 'none', showDelay: 0, hideDelay: 0 })"
        @keyup="$listeners.keyup || undefined"
      >
        <template #append>
          <CButton type="button" color="info" :disabled="disabled || (selectedDate === null) ? true : false" @click="selectedDate = null">Clear</CButton>
        </template>
      </CInput>
    </template>
  </v-date-picker>
</template>

<script>
export default {
  name: 'date-picker',
  props: {
    date: { type: Date },
    mask: { type: String },
    label: { type: String },
    attributes: { type: Array },
    horizontal: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  computed: {
    selectedDate: {
      get () {
        return this.date
      },
      set (val) {
        this.$emit('update:date', val)
      }
    }
  }
}
</script>

<style>

</style>