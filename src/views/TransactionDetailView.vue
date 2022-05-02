<template>
    <div class="center">
        <vk-notification status="success" :messages.sync="messages"></vk-notification>
        <h1> View/Edit Transaction </h1>
        <div class="uk-container uk-margin-top">
            <form>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-date">Date:</label>
                    <div class="uk-form-controls">
                        <date-picker ref="datepicker" v-model="date" id="form-date"/>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-stacked-text">Description:</label>
                    <div class="uk-form-controls">
                        <input class="uk-input uk-form-width-medium" v-model="description" id="form-stacked-text" type="text" />
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-category">Select Category:</label>
                    <div class="uk-form-controls">
                        <select v-model="category" class="uk-select uk-form-width-medium" id="form-category">
                            <option v-for="category in categories" :key="category.id">{{ category.category }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-payment-type">Select Payment Type:</label>
                    <div class="uk-form-controls">
                        <select v-model="paymentType" class="uk-select uk-form-width-medium" id="form-payment-type">
                            <option v-for="paymentType in paymentTypes" :key="paymentType.id">{{ paymentType.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-amount">Total Amount:</label>
                    <div class="uk-form-controls">
                        <currency-input ref="amount" class="uk-input uk-form-width-medium" id="form-amount" v-model="amount" :options="{ currency: 'USD' }" />
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-location">Location:</label>
                    <div class="uk-form-controls">
                        <vue-google-autocomplete ref="location" v-model="location" id="form-location" class="uk-input uk-form-width-large" enable-geolocation placeholder="Start typing" v-on:placechanged="getCoordinates">
                        </vue-google-autocomplete>
                    </div>
                </div>
                <!-- <vk-button class="uk-margin-right" type="primary" @click="saveTransaction">Save</vk-button>
                <vk-button type="primary" @click="saveAndClose">Save and Close</vk-button> -->
                <vk-button-group ref="group">
                    <vk-button  type="primary" @click="saveTransaction">Save</vk-button>
                    <div class="uk-inline">
                        <vk-button type="primary">
                            <vk-icon icon="triangle-down"></vk-icon>
                        </vk-button>
                        <vk-dropdown mode="click" boundary="group" boundary-align>
                        <vk-nav-dropdown>
                            <vk-nav-item @click="saveAndClose" title="Save &amp; Close" active></vk-nav-item>
                        </vk-nav-dropdown>
                        </vk-dropdown>
                    </div>
                </vk-button-group>
                <vk-button class="uk-margin-left" type="danger" @click="deleteTransaction">Delete</vk-button>
            </form>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
            <br>
        </div>
    </div>
</template>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDJvZKWBDIdBU7I2Y92l4YvqSbHrpQ4qKE&libraries=places"></script>
<script>
import { db, auth } from '@/firebaseConfig'

// https://dm4t2.github.io/vue-currency-input/guide.html#creating-a-custom-component
import CurrencyInput from '../components/CurrencyInput.vue'

// https://vcalendar.io/datepicker.html
import DatePicker from 'v-calendar/lib/components/date-picker.umd';

// https://www.npmjs.com/package/vue-google-autocomplete
import VueGoogleAutocomplete from "vue-google-autocomplete";
import firebase from "firebase/app";
export default {
    props:["transactionId"],
    components: { CurrencyInput, DatePicker, VueGoogleAutocomplete },
    data: function() {
        return {
            date: null,
            description: null,
            category: null,
            categories: false,
            paymentType: null,
            paymentTypes: false,
            location: null,
            latitude: null,
            longitude: null,
            amount: null,
            transactionData: false,
            messages: []
        }
    },
    firestore: function() {
        return {
            transactionData: db.collection('transactions').doc(this.transactionId),
            categories: db.collection('spendingCategories').where("user", "==", auth.currentUser.uid).orderBy('category'),
            paymentTypes: db.collection('paymentTypes').orderBy('name')
        }
    },
    methods: {
        validateTransaction: function() {
            this.description = this.description.trim()
            return (this.date && this.description.length > 0 && this.category.length > 0 && this.paymentType.length > 0 && this.amount > 0)
        },
        saveTransaction: function() {
            if (this.validateTransaction()) {
                console.log({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    coordinates: new firebase.firestore.GeoPoint(this.latitude, this.longitude),
                    location: this.location,
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                db.collection('transactions').doc(this.transactionId).update({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    coordinates: new firebase.firestore.GeoPoint(this.latitude, this.longitude),
                    location: this.location,
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                this.messages.push({ message: 'Transaction Successfully Saved', status: 'success', timeout: 3000 })
                return true
            } else {
                this.messages.push({ message: 'Save Failed: One or More Fields are Empty', status: 'danger', timeout: 3000 })
                return false
            }
        },
        saveAndClose: function() {
            if (this.saveTransaction()) {
                this.$router.go(-1)
            }
        },
        deleteTransaction: function() {
            db.collection("transactions").doc(this.transactionId).delete()
            this.$router.go(-1)
        },
        getCoordinates: function(addressData, placeResultData) {
            this.location = placeResultData.formatted_address
            this.latitude = addressData.latitude
            this.longitude = addressData.longitude
        }
    },
    watch: {
        transactionData: function(newData) {
            if (newData == null) {
                this.$router.push('/404')
            } else {
                this.date = newData.date.toDate()
                this.description = newData.description
                this.category = newData.category
                this.paymentType = newData.paymentType
                this.location = newData.location
                this.latitude = newData.coordinates._lat
                this.longitude = newData.coordinates._long
                this.amount = newData.amount
                this.$refs.datepicker.move(this.date)
            }
      }
    }
}
</script>

<style>

</style>