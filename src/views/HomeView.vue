<template>
  <div class="bod">
    <div class="center very-center">

      <p>Governmint</p>
      <span>Where you can track all your spending habits</span>
      <br>
      <br>
      <br>
      <login-button/>
    </div>
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
p {
  font-size: 10em;
  font-family: cursive;
  color: rgba(156,237,225,255);
}

span {
  font-size: 2em;
  font-family: 'Times New Roman';
}

.very-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
