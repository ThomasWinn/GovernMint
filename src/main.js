import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuikit from 'vuikit'
import VuikitIcons from '@vuikit/icons'

import '@vuikit/theme'
import { auth } from "@/firebaseConfig";

import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)
Vue.use(Vuikit)
Vue.use(VuikitIcons)

Vue.config.productionTip = false
let app

auth.onAuthStateChanged(()=>{
  if (!app) {
    new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }  
});

