<template>
  <span v-if="!editMode" @click="editMode=true" > {{text}} </span>
  <input v-else          @blur="clickOut" v-model="inputContent"/>
</template>

<script>
export default {
  name: 'EditableSpan',
  props: {
    text:String
  },
  data: function() {
      return {
          editMode: false,
          inputContent: this.text
      }
  },
  methods:{
      clickOut: function() {
          this.editMode = false;
          this.$emit("edited", this.inputContent)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
