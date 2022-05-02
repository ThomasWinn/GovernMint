<template>
    <div class="center">
        <div v-if="owner_transactions === false">
            loading
        </div>
        <div v-else>
            <br>

            <br>
            <h1 class="uk-heading-line uk-text-center"><span>All Transactions</span></h1>
            <button class="uk-button uk-button-default" @click="downloadCSVData()">Export to CSV</button>
                        <button @click="showFilters()" class="uk-button uk-button-default">Click to Expand Filtering</button>
            <div v-if="toShow">
                <br>
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
            <div class="left">
                <div class="uk-overflow-auto">
                    <table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th class="uk-table-expand">Description</th>
                                <th>Category</th>
                                <th>Payment Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody v-for="(trans, index) in limitTrans" :key="index">
                            <tr>
                                <td>
                                    <p>{{ trans.date.toDate().getDate() }}</p>
                        
                                    <p>{{ getMonthAbv(trans.date.toDate().getMonth()) }}</p>
                                </td>
                                <td class="uk-table-link">
                                    <router-link :to="{name:'Transaction Detail', params:{transactionId:trans.id}}"> {{trans.description}}</router-link>
                                </td>
                                <td>{{ trans.category }}</td>
                                <td>{{ trans.paymentType }}</td>
                                <td>${{ trans.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- <span uk-icon="icon: plus-circle; ratio: 3.5"></span> -->
            <!-- {{owner_transactions.length - 1}} - {{this.limit}} == {{owner_transactions.length - 1 - this.limit}} -->
            <!-- <div v-if="(owner_transactions.length - 1) - this.limit >= 0"> -->
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
    data: function() {
        return {
            owner_transactions: false,
            profile: false,
            limit: 8,
            showSeeMore: true,
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
            if (this.owner_transactions.length - 1 <= this.limit + 3) {
                this.limit = this.owner_transactions.length
                this.showSeeMore = false;
            }
            else {
                this.limit += 3;
                this.showSeeMore = true;
            }
            console.log(this.limit);
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
            // let prop_dict = {
            //     time_filter: parseInt(this.chosen_time.substring(0, this.chosen_time.indexOf(')'))),
            //     category_filter: this.chosen_category,
            //     pType_filter: this.chosen_payment_type,
            //     money_filter: parseInt(this.chosen_higher_lower_bound.substring(0, this.chosen_higher_lower_bound.indexOf(')')))
            // };
            let prop_dict = {
                time_filter: this.chosen_time,
                category_filter: this.chosen_category,
                pType_filter: this.chosen_payment_type,
                money_filter: this.chosen_higher_lower_bound
            };
            return this.$router.push({name: 'FilterResults', params: {filtered: prop_dict}});
        },
        // https://stackoverflow.com/questions/58292771/downloading-a-csv-of-file-using-vue-and-js
        downloadCSVData: function() {
            let csv = 'Date, Description, Location, Category, Payment Type, Amount\n';
            for (let i = 0; i < this.owner_transactions.length; i++) {
                csv += this.owner_transactions[i].date.toDate() + ',';
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
        },
    },
    computed: {
        limitTrans: function() {
            return this.owner_transactions.slice(0, this.limit)
        }
    }
}
</script>

<style>

</style>