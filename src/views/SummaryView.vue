<template>
    <div v-if = "owner_transactions.length == 0">
        <h1 style = "text-align: center" class = "uk-heading-xlarge">Transactions must be added to view summary</h1>
    </div>
    <div v-else style = "text-align: center">
        <br>
        <span class="uk-label" style = "text-align: center" >Select a graph type</span>
        <select class = "uk-select" style = "text-align-last:center" id="graph" name="graph" @change = "onChange($event)">
            <option selected value="Pie" >Pie</option>
            <option value="Bar">Bar</option>
            <option value="Radar">Radar</option>
        </select>

        <RadarChart v-if = "loaded && loadRadar" :chart-data="chartData" :chart-options="chartOptions" />
        <BarChart v-if = "loaded && loadBar" :chart-data="chartData" :chart-options="chartOptions" />
        <PieChart v-if = "loaded && loadPie" :chart-data="chartData" :chart-options="chartOptions" />

        <h1 class="uk-heading-bullet"> Key Summary </h1>
        <ul class="uk-list uk-list-divider">
            <li>Your top 3 spending categories are {{sorted_categories[0][0]}}, {{sorted_categories[1][0]}}, and {{sorted_categories[2][0]}}</li>
            <li v-if ="budget_percent != 0">You have spent {{budget_percent}}% of your budget.</li>
            <li>Your most used payment type is {{sorted_payTypes[0][0]}} </li>
        </ul>
        <div>
                <br>
                <h2>Click a Marker to View Details</h2>
                <GmapAutocomplete
                    @place_changed='setPlace'
                />
            </div>
            <br>
            <vk-grid>
                <div class="uk-width-1-2@m">
                    <GmapMap
                        :center="center"
                        :zoom='12'
                        style='width:100%;  height: 500px;'
                    >
                    <GmapMarker
                        :key="index"
                        v-for="(m, index) in markers"
                        :position="m.position"
                        @click="viewMarker(m)"
                    />
                    </GmapMap>
                </div>
                <div class="uk-width-1-2@m">
                    <h3 class = "uk-text-bold"> Transaction Details: </h3>
                    <div v-if="currentMarker" class = "uk-text-bottom">
                        <p> Date: {{currentMarker.date}} </p>
                        <p> Description: {{currentMarker.description}} </p>
                        <p> Amount: ${{currentMarker.amount}} </p>
                        <p> Address: {{currentMarker.address}} </p>
                        <p> Category: {{currentMarker.category}} </p>
                        <p> Payment Type: {{currentMarker.paymentType}} </p>
                        <router-link :to="{name:'Transaction Detail', params:{transactionId:currentMarker.id}}"> View More Details </router-link>
                    </div>
                </div>
            </vk-grid>
    </div>
</template>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.min.js"></script>
<script type="text/javascript" src="jscript/graph.js"></script>
<script>

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { db, auth } from '@/firebaseConfig'
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

import PieChart from '../components/PieChart.vue'
import RadarChart from '../components/RadarChart.vue'
import BarChart from '../components/BarChart.vue'
export default {
    name: 'App',
    components: { PieChart, RadarChart, BarChart },
        data: () => ({
        center: { lat: 44.9778, lng: 93.2650 },
        currentPlace: null,
        currentMarker: null,
        markers: [],
        places: [],
        transactions: null,

        loaded: false,
        loadPie: true,
        loadBar: false,
        loadRadar: false,
        profile: null,
        budget_percent: 0,
        chartData: { labels:["dog"], datasets: ["3"] },
        owner_transactions: null,
        sorted_categories: null,
        sorted_payTypes: null,
        chartOptions: {
            responsive: true,
            maintainAspectRatio: false,
            plugins:{
                title: {
                    display: true,
                    text: 'Total Transactions for each Category'
                 }
            }
        }
    }),
    mounted() {
        this.geolocate();
    },
    watch: {
        transactions: function(newData) {
            for (const index in newData) {
                const transaction = newData[index]
                const coords = { 
                    lat: parseFloat(transaction.coordinates.latitude),
                    lng: parseFloat(transaction.coordinates.longitude)
                }
                this.markers.push({
                    position: coords,
                    id: transaction.id,
                    description: transaction.description,
                    address: transaction.location,
                    date: transaction.date.toDate().toDateString(),
                    amount: transaction.amount.toFixed(2),
                    category: transaction.category,
                    paymentType: transaction.paymentType
                })
            }
        },
        owner_transactions(new_transaction, old_transaction) {
            console.log(this.owner_transactions.length)
            this.loaded = false
            var category_totals = {}
            console.log(this.owner_transactions.length)
            for(let i = 0; i < this.owner_transactions.length; i++) {
                if(!Object.prototype.hasOwnProperty.call(category_totals,this.owner_transactions[i].category)) {
                    category_totals[this.owner_transactions[i].category] = this.owner_transactions[i].amount
                }   
                else {
                    category_totals[this.owner_transactions[i].category] += this.owner_transactions[i].amount
                }
            }
            this.chartData = {labels: Object.keys(category_totals), datasets: [{data: Object.values(category_totals), backgroundColor: [ 'lightsteelblue', '#00D8FF', 'yellow',"lightgreen","PaleTurquoise", "plum", "slategrey", "silver" ], fill: true, label: "User summary", }]}
            this.loaded = true
            var categories = Object.keys(category_totals).map(function(key) {
                return [key, category_totals[key]]
            })
            categories.sort(function(first,second) {
                return second[1] - first[1];
            })
            this.sorted_categories = categories


            var payment_frequencies = {}
            for(let i = 0; i < this.owner_transactions.length; i++) {
                if(!Object.prototype.hasOwnProperty.call(payment_frequencies,this.owner_transactions[i].paymentType)) {
                    payment_frequencies[this.owner_transactions[i].paymentType] = 0
                }   
                else {
                    payment_frequencies[this.owner_transactions[i].paymentType] += 1
                }
            }
            console.log(payment_frequencies)
            var paymentTypes = Object.keys(payment_frequencies).map(function(key) {
                return [key, payment_frequencies[key]]
            })
            paymentTypes.sort(function(first,second) {
                return second[1] - first[1];
            })
            this.sorted_payTypes = paymentTypes


        },
        profile(new_profile, old_profile) {
            var spent = 0;
            this.owner_transactions.forEach(e => {
                spent += e.amount;
            });
            console.log("here")
            console.log(this.profile[0].balance)
            this.budget_percent = (spent / this.profile[0].balance * 100).toFixed(2)
            console.log(this.budget_percent)
        }
    },
    methods: {
        setPlace(place) {
            const marker = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            };
            this.center = marker
        },
        viewMarker(marker) {
            console.log(marker)
            this.currentMarker = marker
            this.center = marker.position
        },
        geolocate: function() {
            navigator.geolocation.getCurrentPosition(position => {
                this.center = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
            });
        },
        onChange(event) {
            if(event.target.value == "Pie") {
                this.loadBar = false
                this.loadRadar = false
                this.loadPie = true
            }
            else if (event.target.value == "Bar") {
                this.loadPie = false
                this.loadRadar = false
                this.loadBar = true
                this.chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins:{
                        title: {
                            display: true,
                            text: 'Total Transactions for each Category'
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            }
                        }
                    }
                }
            }
            else if (event.target.value == "Radar") {
                this.chartOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins:{
                        title: {
                            display: true,
                            text: 'Total Transactions for each Category'
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            }
                        }
                    }
                }
                this.loadPie = false
                this.loadBar = false
                this.loadRadar = true
            }
        },
    },
    firestore: function() {        
        return {
            spendingCategories: db.collection("spendingCategories").where('user', '==', auth.currentUser.uid),
            owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid),
            profile: db.collection('profile').where('owner', '==', auth.currentUser.uid),
            transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).orderBy('date', 'desc')
        }
    }


}
</script>

<style>

</style>