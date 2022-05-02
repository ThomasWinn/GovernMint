<template>
  <div class="center">
    <div v-if="profile == false">
      <vk-spinner></vk-spinner>
    </div>
    <div v-else>
      <vk-notification status="success" :messages.sync="messages"></vk-notification>
      <h1> Monthly Spending Goal for {{category}} </h1>
        <h2> $ <editable-span ref="newlimit" :text="categoryObj.limit" @edited="updateLimit" /> </h2>
      <div class="uk-flex">
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-1-4@m uk-background-primary uk-light uk-padding uk-panel">
          <p class="uk-h4">Remaining Balance</p>
        </div>
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-3-4@m uk-background-muted uk-padding uk-panel">
          <p class="uk-h4"> ${{ spent }} </p>
        </div>
      </div>

      <br>
      <h1 class="uk-heading-line uk-text-center"><span>Recent Transactions</span></h1>
      <div class="left">
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
                      <tr v-if="trans.category == category">
                          <td>
                              <p>{{ trans.date.toDate().toDateString() }}</p>
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
      <!-- <span uk-icon="icon: plus-circle; ratio: 3.5"></span> -->
      <!-- <button @click="showMore()" class="uk-button uk-button-primary uk-button-large uk-width-1-1">See More</button> -->
    </div> 
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
import EditableSpan from '@/components/EditableSpan.vue'
export default {
  components: { EditableSpan },
  name: 'BudgetCategoryView',
  props:['id', 'category'],
  data: function() {
    return {
      owner_transactions: false,
      profile: false,
      categoryObj: false,
      category_transactions: false,
      changeTotal: 0,
      messages: []
    }
  },
  firestore: function() {
    return {
      categoryObj: db.collection("spendingCategories").doc(this.id),
      owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).orderBy('date', 'desc'),
      category_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).where('category', '==', this.category).orderBy('date', 'desc'),
      profile: db.collection('profile').where('owner', '==', auth.currentUser.uid)
    }
  },
  methods: {
    getMonthAbv: function(month_num) {
          var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return month[month_num];
    },
    updateLimit: function(updatedLimit) {
      this.changeTotal = updatedLimit - this.categoryObj.limit
      this.$firestoreRefs.categoryObj.update({limit: parseInt(updatedLimit)});
      db.collection("profile").doc(this.profile[0].id).update({balance: this.profile[0].balance + this.changeTotal})
      // this.changeTotal = updatedLimit - this.categoryObj.limit
      // this.$firestoreRefs.categoryObj.update({limit: parseInt(updatedLimit)});
      // db.collection("profile").doc(this.profile[0].id).update({balance: this.profile[0].balance + this.changeTotal})
    }
  },
  computed: {
      spent: function() {
          var spent = 0;
          this.category_transactions.forEach(e => {
              spent += e.amount;
          });
          return this.categoryObj.limit - spent
      }
  },
}

</script>

<style scoped>
input {
  font-size: 30px;
  max-width: 100px;
}
</style>
