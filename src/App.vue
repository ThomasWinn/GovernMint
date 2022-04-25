<template>
  <div id="app">
    <nav class="uk-navbar-container" uk-navbar v-if="!$route.meta.hideNavbar">
      <div class="uk-navbar-center">
          <ul class="uk-navbar-nav">
              <li class="uk-active"><router-link to="/overview">Overview</router-link></li>
              <li class="uk-active"><router-link to="/monthlyBudget">Monthly Budget</router-link></li>
              <li class="uk-active"><router-link to="/add-transaction">Add Transaction</router-link></li>
              <li class="uk-active"><router-link to="/summary">Summary</router-link></li>
              <li><a href="#"><login-button/></a></li>
          </ul>

      </div>
    </nav>
    <router-view/>
  </div>
</template>

<script>
import { auth } from "@/firebaseConfig";

import LoginButton from './components/LoginButton.vue'
export default {
  components: { LoginButton },
  beforeCreate: function() {

    auth.getRedirectResult().then(result=>{
      if (result.user) {
        console.log('result: ', result)
        this.$router.push("/")
      }
    }).catch(() => {
      this.$router.push("/")
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  color: #2c3e50;
}

.left {
  text-align: left;
}

.center {
  text-align: center;
}

.done-list {
    list-style-type: '✅';
}

nav {
  text-align: center;
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.notification-text {
    text-align: center;
}

.preview {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 30em;
}

ul {
  display: inline-block; 
	text-align: left; 
}
</style>
