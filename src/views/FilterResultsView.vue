<template>
    <div class="center">
        <br>
        <div v-if="filtered === false">
            {{ goToAllTransactions() }}
        </div>
        <div v-else>
            <h1 class="uk-heading-line uk-text-center"><span>Filtered Transactions</span></h1>
            <div v-if="owner_transactions === false">
                <vk-spinner></vk-spinner>
            </div>
            <div v-else>
                <!-- {{filtered}} -->
                <!-- {{filtered.values()}} -->
                <!-- <div v-for="val in filtered.values()">
                    <span> {{val}} </span>
                </div> -->
                <!-- {{ getFilterOptions() }} -->
                <table>
                    <tr>
                    <td class="uk-text-default"> <h3> Filtering by: </h3> </td>
                    <span v-for="val in getFilterOptions()" :vid-id="val" :key="val">
                        <td><button class="uk-button uk-button-default">{{val}}</button></td>
                    </span>
                    </tr>
                </table>
                <div v-if="hasTransactions !== false">
                    <button class="uk-button uk-button-default" @click="downloadCSVData()">Export to CSV</button>
                </div>
                <div v-else></div>

                {{ preprocess_filter() }}
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
                            <tbody v-for="(trans, index) in this.filtered_list" :key="index">
                                <tr>
                                    <td>
                                        <p>{{ trans.date.toDate().toDateString() }}</p>
                                    </td>
                                    <td class="uk-table-link">
                                        <router-link :to="{name:'Transaction Detail', params:{transactionId:trans.id}}"> {{trans.description}} </router-link>
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
                <!-- <button @click="showMore()" class="uk-button uk-button-primary uk-button-large uk-width-1-1">See More</button> -->
            </div>
            <button class="uk-button uk-button-default" @click="goToAllT()"> Return to all Transactions </button>
        </div>
    </div> 
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    props: {
        'filtered': {
            default: false
        }
    },
    data: function() {
        return {
            owner_transactions: false,
            profile: false,
            limit: 8,
            toShow: false,
            amount_bound: ["1) $0 - $20", "2) $20.01 - $50", "3) $50.01 - $100", "4) $100+"],
            time_ago: ["1) 1 day ago", "2) 1 week ago", "3) 1 month ago", "4) 1 year ago"],
            unique_categories: [],
            unique_payment_type: [],
            chosen_category: "",
            chosen_payment_type: "",
            chosen_time: "",
            chosen_higher_lower_bound: "",
            changed: false,
            filtered_list: [],
            time_dicky: {
                1: 24 * 60 * 60 * 1000, // day ago
                2: 7 * 24 * 60 * 60 * 1000, // 1 week ago
                3: 4 * 7 * 24 * 60 * 60 * 1000, // 1 month ago
                4: 12 * 4 * 7 * 24 * 60 * 60 * 1000 // 1 year ago
            },
            money_bounding_dicky: {
                1: [0, 20],
                2: [20, 50],
                3: [50, 100],
                4: [100, 9999999999]
            },
            hasTransactions: false
        }
    },
    firestore: function() {
        return {
            owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).orderBy('date', 'desc'),
            profile: db.collection('profile').where('owner', '==', auth.currentUser.uid)
        }
    },
    methods: {
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
                time_filter: this.chosen_time,
                category_filter: this.chosen_category,
                pType_filter: this.chosen_payment_type,
                money_filter: this.chosen_higher_lower_bound
            };
            return this.$router.push({name: 'FilterResults', params: {filtered: prop_dict}});
        },
        goToAllTransactions: function() {
            this.$router.push({name: 'AllTransactions'});
        },
        preprocess_filter: function() {
            if (!this.changed && this.owner_transactions.length > 0) {
                console.log('chilling');
                this.changed = true;
                let todays_date = new Date();
                for (let i = 0; i < this.owner_transactions.length; i++ ) {
                    let tranny = this.owner_transactions[i];
                    let can_add = false;
                    if (this.filtered['time_filter'] !== '') {
                    
                        var filter_date_str = this.filtered['time_filter']
                        console.log(filter_date_str);
                        var date_label = parseInt(filter_date_str.substring(0, filter_date_str.indexOf(')')))
                        
                        if ((todays_date.getTime() - this.time_dicky[date_label]) < tranny.date.toDate().getTime() && todays_date.getTime() > tranny.date.toDate().getTime()) {
                            console.log(tranny.date.toDate())
                            can_add = true;
                        }
                        else {
                            continue;
                        }
                    }
                    if (this.filtered['category_filter'] !== '') {
                        console.log(this.filtered['category_filter']);
                        if (this.filtered['category_filter'] === tranny.category) {
                            can_add = true;
                        }
                        else {
                            continue;
                        }
                    }
                    if (this.filtered['pType_filter'] !== '') {
                        console.log(this.filtered['category_filter']);
                        if (this.filtered['pType_filter'] === tranny.paymentType) {
                            can_add = true;
                        }
                        else {
                            continue;
                        }
                    }
                    if (this.filtered['money_filter'] !== '') {
                        var filter_money_str = this.filtered['money_filter']
                        var money_label = parseInt(filter_money_str.substring(0, filter_money_str.indexOf(')')))
                        if (this.money_bounding_dicky[money_label][0] < tranny.amount && tranny.amount <= this.money_bounding_dicky[money_label][1]) {
                            can_add = true;
                        }
                        else {
                            continue;
                        }
                    }
                    if (can_add) {
                        console.log(this.owner_transactions[i].date.toDate());
                        this.filtered_list.push(this.owner_transactions[i]);
                    }
                    else {
                        console.log('IT SHOULDVE NEVER CAME HERE');
                    }
                }
                console.log(this.filtered_list);
                console.log(this.filtered_list.length);
            }
            else {
                console.log('woof woof');
            }
            if (this.filtered_list.length > 0) {
                this.hasTransactions = true;
            }
        },
        getFilterOptions: function() {
            console.log("Jefftest")
            var new_fol = []
            var filter_option_list = Object.values(this.filtered)
            for (let i = 0; i < filter_option_list.length; i++ ){
                console.log(filter_option_list[1])
                if(filter_option_list[i] !== ''){
                    if(i === 0 || i == 3) {
                        new_fol.push(filter_option_list[i].slice(3))
                    } else {
                        new_fol.push(filter_option_list[i])
                    }
                }
            }
            console.log(new_fol)
            return new_fol
        },
        goToAllT: function() {
            this.$router.push({name: "AllTransactions"})
        },
        // https://stackoverflow.com/questions/58292771/downloading-a-csv-of-file-using-vue-and-js
        downloadCSVData: function() {
            let csv = 'Date, Description, Location, Category, Payment Type, Amount\n';
            for (let i = 0; i < this.filtered_list.length; i++) {
                // let thisDate = new Date(this.filtered_list[i].date);

                // console.log(this.filtered_list[i].date.toDate());
                // csv += thisDate.toLocaleDateString('en-US') + ',';
                csv += this.filtered_list[i].date.toDate() + ',';
                csv += this.filtered_list[i].description.replace(/,/g, '') + ',';
                csv += this.filtered_list[i].location.replace(/,/g, '') + ',';
                csv += this.filtered_list[i].category.replace(/,/g, '') + ',';
                csv += this.filtered_list[i].paymentType + ',';
                csv += '$' + this.filtered_list[i].amount ;
                csv += '\n';
            }
            const anchor = document.createElement('a');
            anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
            anchor.target = '_blank';
            anchor.download = 'MyFilteredTransactions.csv';
            anchor.click();
        },
    },
    computed: {
        limitTrans: function() {
            return this.filtered_list.slice(0, this.limit)
        }
    }
}
</script>

<style scoped>
table {
  margin-left: auto;
  margin-right: auto;
}
</style>