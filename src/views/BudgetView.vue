<template>
    <div class="center">
        <vk-notification status="success" :messages.sync="messages"></vk-notification>
        <h1> Current Monthly Spending Goal </h1>
        <h2> ${{total}} </h2>
        <ul v-if="spendingCategories !== false">
        <input class="uk-input uk-form-width-medium" v-model="newCategory" id="form-stacked-text" type="text"> <currency-input ref="amount" class="uk-input uk-form-width-medium" id="form-amount" onClick="this.select();" v-model="newLimit" :options="{ currency: 'USD' }" /> <vk-button @click="addNewCategory">+</vk-button> <br> <br>

        <li v-for="category in spendingCategories" :key="category.id">
            <div class="uk-flex">
                    <router-link class="uk-card-small uk-card-default uk-card-body uk-margin-left uk-width-3-4@m uk-background-primary uk-light uk-padding uk-panel" style="text-decoration: none; text-align: right;; color: inherit;" :to="{ name: 'oneCategory', params: { id: category.id, category: category.category } }">
                        <p class="uk-h4">{{category.category}}</p>  
                    </router-link> 
                <div class="uk-card-small uk-card-default uk-card-body uk-margin-left uk-width-1-4@m uk-background-muted uk-padding uk-panel">
                    <p class="uk-h4">  ${{category.limit}} </p>
                </div>
            </div>
            <p></p>
        </li>
        <!-- <input class="uk-input uk-form-width-medium" v-model="newCategory" id="form-stacked-text" type="text"> <currency-input ref="amount" class="uk-input uk-form-width-medium" id="form-amount" onClick="this.select();" v-model="newLimit" :options="{ currency: 'USD' }" /> <vk-button @click="addNewCategory">+</vk-button> <br> -->
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
            unique_categories: [],
            newCategory: "",
            newLimit: 0,
            messages: [],
            totalBudget: 0
        }
    },
    methods: {
        validateTransaction: function() {
            return (this.newCategory != "" && this.newLimit > 0)
        },
        addNewCategory: function() {
            if (this.validateTransaction()) {
                for (let i = 0; i < this.spendingCategories.length; i++) {
                    if (!this.unique_categories.includes(this.spendingCategories[i].category)) {
                        this.unique_categories.push(this.spendingCategories[i].category);
                    }
                }
                let addCategory = {
                    category: this.newCategory,
                    limit: this.newLimit,
                    user: auth.currentUser.uid
                };
                if (!this.unique_categories.includes(this.newCategory)){
                    db.collection("spendingCategories").add(addCategory)
                    db.collection("profile").doc(this.profile[0].id).update({balance: this.total + this.newLimit})
                    this.newCategory = ""
                    this.newLimit = 0
                    this.messages.push({ message: 'Spending Category Successfully Added', status: 'success', timeout: 3000 })
                    return true
                } else {
                    this.messages.push({ message: 'Adding Category Failed: This spending category already exists', status: 'danger', timeout: 3000 })
                    return false
                }
            } else {
                this.messages.push({ message: 'Adding Category Failed: One or More Fields are Empty', status: 'danger', timeout: 3000 })
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
            spendingCategories: db.collection("spendingCategories").where('user', '==', auth.currentUser.uid).orderBy("limit", "desc"),
            profile: db.collection("profile").where("owner", "==", auth.currentUser.uid)
        }
    }
}
</script>

<style scoped>
ul {
  list-style-type: none; /* Remove bullets */
}
</style>