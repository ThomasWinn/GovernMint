<template>
  <div v-if="!editMode" @click="clickIn" > {{text}} </div>
  <textarea v-else ref="editable" @blur="clickOut" v-model="inputContent"/>
</template>

<script>
export default {
  name: 'EditableDiv',
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
      clickIn: function() {
        this.editMode = true
        this.$nextTick(() => {
          this.$refs.editable.focus()
        });
      },
      clickOut: function() {
          this.editMode = false
          this.$emit("edited", this.inputContent)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
