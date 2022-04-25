<template>
  <div class="left">
    <div v-if="owner_transactions == false || profile == false">
      <vk-spinner></vk-spinner>
    </div>
    <div v-else>
      <br>
      <h1 class="uk-heading-line uk-text-center"><span>Recent Transactions</span></h1>
      <!-- limit to 5 in the future -->
      <!-- <dl class="uk-description-list uk-description-list-divider" style="text-align: left;">
        <div v-for="(trans, index) in owner_transactions" :key="index">
            <router-link :to="{name:'Transaction Detail', params:{transactionId:trans.id}}"> {{trans.description}} </router-link>
            <dd>{{ trans.category }}</dd>
            <dd>{{ trans.amount }}</dd>
            <dd>{{ trans.date.toDate().toDateString() }}</dd>
            <dd>{{ trans.location }}</dd>
            <dd>{{ trans.paymentType}}</dd>
            <hr class="solid">

        </div>
      </dl> -->
      <div class="uk-overflow-auto">
            <table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th class="uk-table-expand">Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody v-for="(trans, index) in owner_transactions" :key="index">
                    <tr>
                        <td>
                            <p>{{ trans.date.toDate().getDay() }}</p>
                
                            <p>{{ get_month(trans.date.toDate().getMonth()) }}</p>
                        </td>
                        <td class="uk-table-link">
                            <router-link :to="{name:'Transaction Detail', params:{transactionId:trans.id}}"> {{trans.description}} </router-link>
                        </td>
                        <td>{{ trans.category }}</td>
                        <td>${{ trans.amount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div> 
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
  props: ["category", "filter"],
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
      get_month: function(month_num) {
            var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return month[month_num];
      }
      
  }
}
/* Use Pagination. Add page numbers at bottom. Get len(owner_transactions) // 8 add pages at bottom uikit */
</script>

<style scoped>

</style>
