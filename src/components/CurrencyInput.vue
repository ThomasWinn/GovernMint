<template>
  <input ref="inputRef" type="text" />
</template>

<script>
import { useCurrencyInput } from 'vue-currency-input'
import { watch } from '@vue/composition-api'

export default {
  name: 'CurrencyInput',
  props: {
    value: Number, 
    options: Object
  },
  setup(props) {
    const { inputRef, setValue } = useCurrencyInput(props.options)
    watch(
      () => props.value, // Vue 2: props.value
      (value) => {
        setValue(value)
      }
    )
    return { inputRef }
  },
}
</script>