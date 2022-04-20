<template>
  <div class="center">
    Governmint
    <login-button/>
  </div>
</template>

<script>
import LoginButton from '@/components/LoginButton.vue'
export default {
  components: { LoginButton },
  name: 'HomeView',
  data: function() {
    return {
    }
  },
  firestore: function() {
    return {
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>
