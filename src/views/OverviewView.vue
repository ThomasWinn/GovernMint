<template>
  <div class="center">
    <div v-if="owner_transactions == false || profile == false">
      <vk-spinner></vk-spinner>
    </div>
    <div v-else>
      <vk-notification status="success" :messages.sync="messages"></vk-notification>
      <h1> Monthly Spending Goal </h1>
        <h2> ${{profile[0].balance}} </h2>
      <div class="uk-flex">
        <!-- <div class="uk-card uk-card-default uk-card-body uk-width-1-2@m">Item 1</div> -->
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-1-4@m uk-background-primary uk-light uk-padding uk-panel">
          <p class="uk-h4">Remaining Balance</p>
        </div>
        <div class="uk-card uk-card-default uk-card-body uk-margin-left uk-width-3-4@m uk-background-muted uk-padding uk-panel">
          <p class="uk-h4"> ${{ remaining }}</p>

          <progress v-if="percent > 0.66" class="uk-progress progress-green" style="border: 2px solid black" :value="remaining" :max="profile[0].balance"></progress>
          <progress v-else-if="percent > 0.33" class="uk-progress progress-yellow" style="border: 2px solid black" :value="remaining" :max="profile[0].balance"></progress>
          <progress v-else class="uk-progress progress-red" style="border: 2px solid black" :value="remaining" :max="profile[0].balance"></progress>
        </div>
      </div>
      <!-- TODO: Currently stuck on filter applying -->
      <!-- TODO: Filtering brings us to different page without showing remaining balance -->
      <br>
      <h1 class="uk-heading-line uk-text-center"><span>Recent Transactions</span></h1>
      <button class="uk-button uk-button-default" @click="downloadCSVData()">Export to CSV</button>
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
      <div v-if="this.showSeeMore">
          <button @click="showMore()" class="uk-button uk-button-primary uk-button-large uk-width-1-1">See More</button>
      </div>
      <div v-else>
      </div>
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
      showSeeMore: true,
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
      if (this.owner_transactions.length - 1 <= this.limit + 3) {
          this.limit = this.owner_transactions.length - 1
          this.showSeeMore = false;
      }
      else {
          this.limit += 3;
          this.showSeeMore = true;
      }
      console.log(this.limit);
    },
    // https://stackoverflow.com/questions/58292771/downloading-a-csv-of-file-using-vue-and-js
    downloadCSVData: function() {
      // location needs to be stripped of commas same with every other string
      // I believe we dont need to do payment type since it's predefined already
      let csv = 'Date, Description, Location, Category, Payment Type, Amount\n';
      for (let i = 0; i < this.owner_transactions.length; i++) {
        csv += this.owner_transactions[i].date + ',';
        csv += this.owner_transactions[i].description.replace(/,/g, '') + ',';
        csv += this.owner_transactions[i].location.replace(/,/g, '') + ',';
        csv += this.owner_transactions[i].category.replace(/,/g, '') + ',';
        csv += this.owner_transactions[i].paymentType + ',';
        csv += '$' + this.owner_transactions[i].amount ;
        csv += '\n';
      }
      const anchor = document.createElement('a');
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
      anchor.target = '_blank';
      anchor.download = 'MyTransactions.csv';
      anchor.click();
    }
  },
  computed: {
    limitTrans: function() {
      return this.owner_transactions.slice(0, this.limit)
    },
    remaining: function() {
      var spent = 0;
      this.owner_transactions.forEach(e => {
          spent += e.amount;
      });
      return (this.profile[0].balance - spent).toFixed(2)
    },
    percent: function() {
      return this.remaining / this.profile[0].balance
    }
  }
}
/* Use Pagination. Add page numbers at bottom. Get len(owner_transactions) // 8 add pages at bottom uikit */
</script>

<style scoped>
.uk-progress.progress-green::-webkit-progress-value {
  background-color: Green ;
}
.uk-progress.progress-green::-moz-progress-bar {
  background-color: Green ;
}
.uk-progress.progress-green::-ms-fill {
  background-color: Green ;
}

.uk-progress.progress-yellow::-webkit-progress-value {
  background-color: rgb(255, 183, 0) ;
}
.uk-progress.progress-yellow::-moz-progress-bar {
  background-color: rgb(255, 183, 0) ;
}
.uk-progress.progress-yellow::-ms-fill {
  background-color: rgb(255, 183, 0) ;
}

.uk-progress.progress-red::-webkit-progress-value {
  background-color: red ;
}
.uk-progress.progress-red::-moz-progress-bar {
  background-color: red ;
}
.uk-progress.progress-red::-ms-fill {
  background-color: red ;
}


</style>
