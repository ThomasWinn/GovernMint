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
                {{filtered}}
                {{ preprocess_filter() }}
                <div class="left">
                    <div class="uk-overflow-auto">
                        <table class="uk-table uk-table-hover uk-table-middle uk-table-divider">
                            <thead>
                                <tr>
                                    <th>Full Date</th>
                                    <th>Date</th>
                                    <th class="uk-table-expand">Description</th>
                                    <th>Category</th>
                                    <th>Payment Type</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody v-for="(trans, index) in this.filtered_list" :key="index">
                                <tr>
                                    <td> {{trans.date.toDate()}}
                                    <td>
                                        <p>{{ trans.date.toDate().getDate() }}</p>
                            
                                        <p>{{ getMonthAbv(trans.date.toDate().getMonth()) }}</p>
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
            }
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
        },
        goToAllTransactions: function() {
            this.$router.push({name: 'AllTransactions'});
        },
        preprocess_filter: function() {
            if (!this.changed && this.owner_transactions.length > 0) {
                console.log('chilling');
                this.changed = true;
                // id the nulls

                // THIS NEEDS TO BE UNCOMMENTED FOR time_filter
                // let todays_date = new Date();
                for (let i = 0; i < this.owner_transactions.length; i++ ) {
                    // how am i going to account for nulls?
                    let tranny = this.owner_transactions[i];
                    let can_add = false;
                    // if (this.filtered['time_filter'] !== null) {
                    //     // console.log(todays_date.getTime() + ' - ' + tranny.date.toDate().getTime());
                    //     // console.log(todays_date.getTime() - tranny.date.toDate().getTime());
                    //     // console.log(this.time_dicky[this.filtered['time_filter']]);
                    //     if ((todays_date.getTime() - this.time_dicky[this.filtered['time_filter']]) < tranny.date.toDate().getTime() && todays_date.getTime() > tranny.date.toDate().getTime()) {
                    //         console.log(tranny.date.toDate())
                    //         can_add = true;
                    //     }
                    //     else {
                    //         continue;
                    //     }
                    // }
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
                    // TODO: HOW DO I CHECK FOR NULL VALUES
                    // if (!this.filtered['money_filter']) {
                    //     console.log(this.filtered['money_filter']);
                    //     if (this.money_bounding_dicky[this.filtered['money_filter']][0] < tranny.amount && tranny.amount <= this.money_bounding_dicky[this.filtered['money_filter']][1]) {
                    //         can_add = true;
                    //     }
                    //     else {
                    //         continue;
                    //     }
                    // }
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
        }
    },
    computed: {
        limitTrans: function() {
            return this.filtered_list.slice(0, this.limit)
        }
    }
}
</script>

<style>

</style>