<template>
    <div class="center">
        <vk-notification status="success" :messages.sync="messages"></vk-notification>
        <h1> Add Transaction </h1>
        <div class="uk-container uk-margin-top">
            <form>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-date">Date:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <date-picker v-model="date" id="form-date"/>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-stacked-text">Description:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <input class="uk-input uk-form-width-medium" v-model="description" id="form-stacked-text" type="text" />
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-category">Select Category:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <select v-model="category" class="uk-select uk-form-width-medium" id="form-category">
                            <option v-for="category in categories" :key="category.id">{{ category.category }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label uk-margin-right" for="form-payment-type">Select Payment Type:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <select v-model="paymentType" class="uk-select uk-form-width-medium" id="form-payment-type">
                            <option v-for="paymentType in paymentTypes" :key="paymentType.id">{{ paymentType.name }}</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-amount">Total Amount:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <currency-input ref="amount" class="uk-input uk-form-width-medium" id="form-amount" v-model="amount" :options="{ currency: 'USD' }" />
                    </div>
                </div>
                <div class="uk-margin">
                    <label class="uk-form-label" for="form-location">Location:
                        <span style="color:red"><strong>*</strong></span>
                    </label>
                    <div class="uk-form-controls">
                        <vue-google-autocomplete ref="location" 
                            v-model="location" 
                            id="form-location" 
                            class="uk-input uk-form-width-large" 
                            enable-geolocation 
                            v-on:placechanged="getCoordinates"
                            >
                            <!-- v-on:inputChange="clearLocation"> -->
                        </vue-google-autocomplete>
                    </div>
                </div>
                <vk-button-group ref="group">
                    <vk-button  type="primary" @click="saveAndNew">Save &amp; New</vk-button>
                    <div class="uk-inline">
                        <vk-button type="primary">
                            <vk-icon icon="triangle-down"></vk-icon>
                        </vk-button>
                        <vk-dropdown mode="click" boundary="group" boundary-align>
                            <vk-nav-dropdown>
                                <vk-nav-item @click="saveAndClose" title="Save &amp; Close" active></vk-nav-item>
                                <br>
                                <vk-nav-item @click="saveAndView" title="Save &amp; View" active></vk-nav-item>
                            </vk-nav-dropdown>
                        </vk-dropdown>
                    </div>
                </vk-button-group>
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
    components: { CurrencyInput, DatePicker, VueGoogleAutocomplete },
    data: function() {
        return {
            date: new Date(),
            description: "",
            category: "",
            categories: false,
            paymentType: "",
            paymentTypes: false,
            location: "",
            latitude: null,
            longitude: null,
            amount: 0,
            messages: [],
            new_id: null,
        }
    },
    firestore: function() {
        return {
            categories: db.collection('spendingCategories').where("user", "==", auth.currentUser.uid).orderBy('category'),
            paymentTypes: db.collection('paymentTypes').orderBy('name'),
        }
    },
    methods: {
        validateTransaction: function() {
            this.description = this.description.trim()
            return (this.date && this.description.length > 0 && this.category.length > 0 && this.paymentType.length > 0 && this.amount > 0 && this.location)
        },
        saveTransaction: function() {
            if (this.validateTransaction()) {
                console.log({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    location: this.location,
                    coordinates: new firebase.firestore.GeoPoint(this.latitude, this.longitude),
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                let ref = db.collection('transactions').doc()
                this.new_id = ref.id
                ref.set({
                    date: this.date,
                    description: this.description,
                    category: this.category,
                    paymentType: this.paymentType,
                    location: this.location,
                    coordinates: new firebase.firestore.GeoPoint(this.latitude, this.longitude),
                    amount: this.amount,
                    owner: auth.currentUser.uid
                })
                return true
            } else {
                this.messages.push({ message: 'Transaction Failed: One or More Fields are Invalid', status: 'danger', timeout: 3000 })
                return false
            }
        },
        saveAndNew: function() {
            if (this.saveTransaction()) {
                this.$nextTick(() => {
                    this.date = new Date()
                    this.description = ""
                    this.category = ""
                    this.paymentType = ""
                    this.location = ""
                    this.latitude = null
                    this.longitude = null
                    this.amount = 0
                    this.$refs.location.clear()
                });
            }
        },
        saveAndClose: function() {
            if (this.saveTransaction()) {
                this.$router.push('/overview')
            }
        },
        saveAndView: function() {
            if (this.saveTransaction()) {
                this.$nextTick(() => {
                    this.$router.push({name: "Transaction Detail", params: {transactionId: this.new_id}})
                });
            }
        },
        getCoordinates: function(addressData, placeResultData) {
            this.location = placeResultData.formatted_address
            this.latitude = addressData.latitude
            this.longitude = addressData.longitude
        }
    }
}
</script>

<style>

</style>