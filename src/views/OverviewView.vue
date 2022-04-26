<template>
  <div class="center">
    <div v-if="owner_transactions == false || profile == false">
      <vk-spinner></vk-spinner>
    </div>
    <div v-else>
      <br><br>
      <div class="uk-flex">
        <!-- <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">Item 1</div> -->
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-1-4@m uk-background-primary uk-light uk-padding uk-panel">
          <p class="uk-h4">Remaining Balance</p>
        </div>
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-3-4@m uk-background-muted uk-padding uk-panel">
          <p class="uk-h4"> ${{ profile[0].balance }}</p>
        </div>
      </div>
      <!-- TODO: Currently stuck on filter applying -->
      <!-- TODO: Filtering brings us to different page without showing remaining balance -->
      <h3> Filter <button @click="showFilters()">Expand Me!</button></h3>
      <div v-if="toShow">
        <form class="uk-form-horizontal uk-margin-large">
            <div class="uk-margin">
                <label class="uk-form-label" for="form-horizontal-select">How Long Ago?</label>
                <div class="uk-form-controls">
                    <select v-model="chosen_time" class="uk-select" id="form-horizontal-select">
                        <option v-for="(time, tindex) in this.time_ago" :key="tindex">
                          {{ time }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label" for="form-horizontal-select">Show Only What Category?</label>
                <div class="uk-form-controls">
                    <select v-model="chosen_category" class="uk-select" id="form-horizontal-select">
                        <option v-for="(category, index) in this.unique_categories" :key="index">
                          {{ category }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label" for="form-horizontal-select">What Payment Type Was Used?</label>
                <div class="uk-form-controls">
                    <select v-model="chosen_payment_type" class="uk-select" id="form-horizontal-select">
                        <option v-for="(pType, pindex) in this.unique_payment_type" :key="pindex">
                          {{ pType }}
                        </option>
                    </select>
                </div>
            </div>

            <div class="uk-margin">
                <label class="uk-form-label" for="form-horizontal-select">Between What Amount?</label>
                <div class="uk-form-controls">
                    <select v-model="chosen_higher_lower_bound" class="uk-select" id="form-horizontal-select">
                        <option v-for="(aType, aindex) in this.amount_bound" :key="aindex">
                          {{ aType }}
                        </option>
                    </select>
                </div>
            </div>

        </form>
        

      <button @click="filterSearch()" class="uk-button uk-button-primary">Filter</button>
        
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
                  <tbody v-for="(trans, index) in limitTrans" :key="index">
                      <tr>
                          <td>
                              <p>{{ trans.date.toDate().getDay() }}</p>
                  
                              <p>{{ getMonthAbv(trans.date.toDate().getMonth()) }}</p>
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
      <button @click="showMore()" class="uk-button uk-button-primary uk-button-large uk-width-1-1">See More</button>
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
      profile: false,
      limit: 3,
      toShow: false,
      amount_bound: ["1) $0 - $20", "2) $20.01 - $50", "3) $50.01 - $100", "4) $100+"],
      time_ago: ["1) 1 day ago", "2) 1 week ago", "3) 1 month ago", "4) 1 year ago"],
      unique_categories: [],
      unique_payment_type: [],
      chosen_category: "",
      chosen_payment_type: "",
      chosen_time: "",
      chosen_higher_lower_bound: ""
    }
  },
  firestore: function() {
    return {
      owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).orderBy('date', 'desc'),
      profile: db.collection('profile').where('owner', '==', auth.currentUser.uid)
    }
  },
  methods: {
    getMonthAbv: function(month_num) {
          var month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return month[month_num];
    },
    showMore: function() {
      console.log('Old Limit: ' + this.limit + ' -> new limit: ' + this.limit + 3);
      this.limit += 3;
    },
    showFilters: function() {
      if (this.toShow) {
        this.toShow = false;
      }
      else {
        this.toShow = true;
        // get unique categories
        for (let i = 0; i < this.owner_transactions.length; i++) {
          if (!this.unique_categories.includes(this.owner_transactions[i].category)) {
            this.unique_categories.push(this.owner_transactions[i].category);
          }
        }
        // get unique payment Type
        for (let i = 0; i < this.owner_transactions.length; i++) {
          if (!this.unique_payment_type.includes(this.owner_transactions[i].paymentType)) {
            this.unique_payment_type.push(this.owner_transactions[i].paymentType);
          }
        }
      } // end else
    },
    filterSearch: function() {
      // console.log(this.chosen_category)
      console.log(this.chosen_time);
      console.log(this.chosen_category);
      console.log(this.chosen_payment_type);
      console.log(this.chosen_higher_lower_bound);
      console.log();
      let prop_dict = {
        time_filter: parseInt(this.chosen_time.substring(0, this.chosen_time.indexOf(')'))),
        category_filter: this.chosen_category,
        pType_filter: this.chosen_payment_type,
        money_filter: parseInt(this.chosen_higher_lower_bound.substring(0, this.chosen_higher_lower_bound.indexOf(')')))
      };


      return this.$router.push({name: 'FilterResults', params: {filtered: prop_dict}});
    }
  },
  computed: {
    limitTrans: function() {
      return this.owner_transactions.slice(0, this.limit)
    }
  }
}
/* Use Pagination. Add page numbers at bottom. Get len(owner_transactions) // 8 add pages at bottom uikit */
</script>

<style scoped>

</style>
