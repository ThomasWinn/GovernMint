<template>
  <div id = "app">
    <nav class = "navbar" v-show="!$route.meta.hideNavbar">
      <div class = "brand-title">Govern<span style = " color: rgba(156,237,225,255)">Mint</span><img width = 75 height = 75 src ="../public/icon-192x192.png"></div>
      <a href="#" class="toggle-button">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </a>
      <div class = "navbar-links">
        <ul>
            <li class="uk-active"><router-link to="/overview">Overview</router-link></li>
            <li class="uk-active"><router-link to="/allTransactions">All Transaction</router-link></li>
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

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
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
  },
  mounted() {
    const toggleButton = document.getElementsByClassName('toggle-button')[0]
    const navbarLinks = document.getElementsByClassName('navbar-links')[0]

    toggleButton.addEventListener('click', () => {
      navbarLinks.classList.toggle('active')
    })
  }
}
</script>

<style scoped>
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

* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
}

.navbar {
    display: flex;
    position: relative;
    justify-content: space-between;
    align-items: center;
    background-color: #333;
    color: white;
}

.brand-title {
    font-size: 1.5rem;
    margin: .5rem;
}

.navbar-links {
    height: 100%;
}

.navbar-links ul {
    display: flex;
    margin: 0;
    padding: 0;
}

.navbar-links li {
    list-style: none;
}

.navbar-links li a {
    display: block;
    text-decoration: none;
    color: white;
    padding: 2rem;
    /* margin: 0; */
}

.navbar-links li:hover {
    background-color: #555;
}

.toggle-button {
    position: absolute;
    top: .75rem;
    right: 1rem;
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
}

.toggle-button .bar {
    height: 3px;
    width: 100%;
    background-color: white;
    border-radius: 10px;
}

.nav ul {
  margin: 0;
}

@media (max-width: 800px) {
    .navbar {
        flex-direction: column;
        align-items: flex-start;
    }

    .toggle-button {
        display: flex;
    }

    .navbar-links {
        display: none;
        width: 100%;
    }

    .navbar-links ul {
        width: 100%;
        flex-direction: column;
    }

    .navbar-links ul li {
        text-align: center;
    }

    .navbar-links ul li a {
        padding: .5rem 1rem;
    }

    .navbar-links.active {
        display: flex;
    }
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


</style>
