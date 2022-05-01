<template>
    <div style = "text-align: center">
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
 
    watch: {
        owner_transactions(new_transaction, old_transaction) {
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
            this.chartData = {labels: Object.keys(category_totals), datasets: [{data: Object.values(category_totals), backgroundColor: ['lime', '#41B883', '#E46651', '#00D8FF', '#DD1B16',"rgba(255,99,132,1)" ], fill: true, label: "User summary", }]}
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
            this.budget_percent = spent / this.profile[0].balance * 100
            console.log(this.budget_percent)
        }
    },
    methods: {
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
            profile: db.collection('profile').where('owner', '==', auth.currentUser.uid)
       
        }
    }


}
</script>

<style>

</style>