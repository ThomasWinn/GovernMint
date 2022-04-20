<template>
    <div class="center">
        <vk-notification status="success" :messages.sync="messages"></vk-notification>
        <h1> Monthly Spending Goal </h1>
        <h2> ${{total}} </h2>
        <ul v-if="spendingCategories !== false">
        <li v-for="category in spendingCategories" :key="category.id">
            <router-link :to="{ name: 'oneTask', params: { id: category.id } }"> {{category.category}} || ${{category.limit}} </router-link>
        </li>
        <input class="uk-input uk-form-width-medium" v-model="newCategory" id="form-stacked-text" type="text"> <currency-input ref="amount" class="uk-input uk-form-width-medium" id="form-amount" onClick="this.select();" v-model="newLimit" :options="{ currency: 'USD' }" /> <vk-button @click="addNewCategory">+</vk-button> <br>
        </ul>
        <div v-else>
            <vk-spinner></vk-spinner>
        </div>
    </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'

import CurrencyInput from '../components/CurrencyInput.vue'

// import firebase from "firebase/app";
export default {
    components: { CurrencyInput },
    data: function() {
        return {
            spendingCategories: false,
            newCategory: "",
            newLimit: 0,
            messages: []
        }
    },
    methods: {
        validateTransaction: function() {
            console.log({
                    newCategory: this.newCategory
                })
            return (this.newCategory != "" && this.newLimit > 0)
        },
        addNewCategory: function() {
            if (this.validateTransaction()) {
                let addCategory = {
                    category: this.newCategory,
                    limit: this.newLimit,
                    user: auth.currentUser.uid
                };
                this.newCategory = ""
                this.newLimit = ""
                db.collection("spendingCategories").add(addCategory)
                this.messages.push({ message: 'Transaction Successfully Added', status: 'success', timeout: 3000 })
                return true
            } else {
                this.messages.push({ message: 'Transaction Failed: One or More Fields are Empty', status: 'danger', timeout: 3000 })
                return false
            }
        }
    },
    computed: {
        total: function() {
            var sum = 0;
            this.spendingCategories.forEach(e => {
                sum += e.limit;
            });
            return sum
        }
    },
    firestore: function() {
        return {
            spendingCategories: db.collection("spendingCategories").where('user', '==', auth.currentUser.uid)
        }
    }
}
</script>

<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
}
</style>