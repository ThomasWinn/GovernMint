<template>
    <div class="center">
        <h1> Add Transaction </h1>
        <div class="uk-container uk-margin-top">
            <form>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-date">Date:</label>
                    <div class="uk-form-controls">
                        <date-picker v-model="date" id="form-date"/>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-stacked-text">Description:</label>
                    <div class="uk-form-controls">
                        <input class="uk-input uk-form-width-medium" id="form-stacked-text" type="text" />
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-category">Select Category:</label>
                    <div class="uk-form-controls">
                        <select v-model="this.category" class="uk-select uk-form-width-medium" id="form-category">
                            <option v-for="category in categories" :key="category.id">{{ category.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-payment-type">Select Payment Type:</label>
                    <div class="uk-form-controls">
                        <select v-model="this.paymentType" class="uk-select uk-form-width-medium" id="form-payment-type">
                            <option v-for="paymentType in paymentTypes" :key="paymentType.id">{{ paymentType.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-amount">Total Amount:</label>
                    <div class="uk-form-controls">
                        <currency-input class="uk-input uk-form-width-medium" id="form-amount" v-model="amount" :options="{ currency: 'USD' }" />
                    </div>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
import CurrencyInput from '../components/CurrencyInput.vue'
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

export default {
    components: { CurrencyInput, DatePicker },
    data: function() {
        return {
            date: new Date(),
            description: "",
            category: "",
            categories: false,
            paymentType: "",
            paymentTypes: false,
            location: null,
            amount: 0
        }
    },
    firestore: function() {
        return {
            categories: db.collection('categories').orderBy('name'),
            paymentTypes: db.collection('paymentTypes').orderBy('name')
        }
    },
    methods: {
        validateTransaction: function() {
            this.description = this.description.trim()
            return this.date != "" && this.description.length > 0 && this.category.length > 0 && this.paymentType.length > 0 && this.amount > 0
        },
        saveTransaction: function() {
            if (this.validateTransaction()) {
                console.log({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    location: this.location,
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                db.collection('transactions').add({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    location: this.location,
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                this.messages.push({ message: 'Transaction Successfully Added', status: 'success', timeout: 3000 })
                return true
            } else {
                this.messages.push({ message: 'Transaction Failed: One or More Fields are Empty', status: 'danger', timeout: 3000 })
                return false
            }
        },
        saveAndNew: function() {
            if (this.saveTransaction()) {
                this.date = ""
                this.description = ""
                this.category = ""
                this.paymentType = ""
                this.location = null
                this.amount = 0
            }
        },
        saveAndClose: function() {
            if (this.saveTransaction()) {
                this.$router.replace('/')
            }
        }
    }
}
</script>

<style>

</style>