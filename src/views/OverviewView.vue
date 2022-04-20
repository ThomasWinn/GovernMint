<template>
  <div class="center">
    <div v-if="owner_transactions === false || profile === false">
      <vk-spinner></vk-spinner>
    </div>
    <div v-else>
        <button @click="check">checkplz</button>
      <br><br>
      <div class="uk-flex">
        <!-- <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">Item 1</div> -->
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-1-4@m uk-background-primary uk-light uk-padding uk-panel">
          <p class="uk-h4">Remaining Balance</p>
        </div>
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-3-4@m uk-background-muted uk-padding uk-panel">
          <p class="uk-h4"> {{ profile.balance }}</p>
        </div>
      </div>
      <h1 class="uk-heading-line uk-text-center"><span>Recent Transactions</span></h1>
      <!-- limit to 5 in the future -->
      <dl class="uk-description-list uk-description-list-divider" style="text-align: left;">
        <div v-for="(trans, index) in owner_transactions" :key="index">
            <router-link :to="{name:'Transaction Detail', params:{transactionId:trans.id}}"> {{trans.description}} </router-link>
            <dd>{{ trans.category }}</dd>
            <dd>{{ trans.amount }}</dd>
            <dd>{{ trans.date }}</dd>
            <dd>{{ trans.location }}</dd>
            <dd>{{ trans.paymentType}}</dd>
            <hr class="solid">

        </div>
      </dl>
    </div> 
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
  name: 'HomeView',
  data: function() {
    return {
      owner_transactions: false,
      profile: false
    }
  },
  firestore: function() {
    return {
      owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).limit(3),
      profile: db.collection('profile').where('owner', '==', auth.currentUser.uid)
    }
  },
  methods: {
      check: function() {
          console.log(auth.currentUser.uid);
          console.log("owner balance: " + this.profile.owner);
          console.log(this.profile.balance);
      }
  }
}
</script>

<style scoped>

</style>
