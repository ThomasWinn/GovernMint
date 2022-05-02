<template>
  <span v-if="!editMode" @click="clickIn"> {{text}} </span>
  <input v-else type="number" @blur="clickOut" v-model="inputContent" ref="focusfield" />

</template>

<script>
export default {
  name: "EditableSpan",
  props: {
    text:Number
  },
  data: function() {
    return {
      editMode: false,
      inputContent: this.text
    }
  },
  methods: {
    clickOut: function() {
      this.editMode = false;
      this.$emit("edited", this.inputContent)
    },
    clickIn: function() {
      this.editMode = true
      this.$nextTick(() => {
        this.$refs.focusfield.focus()
      });
    }
  }
}
</script>

<style scoped>
input {
  font-size: 18px;
  max-width: 65px;
}

</style>