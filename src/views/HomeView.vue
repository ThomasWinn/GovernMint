<template>
  <div class="bod" >
    <div class="center very-center"  >

      <p style = "max-width: 100%; font-size:8vw"> Govern<span style = "max-width: 100%; font-size:8vw; color: rgba(156,237,225,255)">Mint</span></p>

      <login-button/>
      <br>
      <br>
      <add-to-home-btn>hello</add-to-home-btn>
    </div>
  </div>
</template>

<script>
import LoginButton from '@/components/LoginButton.vue'
import AddToHomeBtn from '@/components/addToHomeBtn.vue'
export default {
  components: { LoginButton, AddToHomeBtn },
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
  font-family: 'Helvetica';
  color: 'black';
}
body{
   background: orange;
}

span {
  font-size: 2em;
  font-family: 'Helvetica';
}

.very-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
