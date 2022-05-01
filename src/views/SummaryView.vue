<template>
    <div style = "text-align: center">
    <span class="uk-label" style = "text-align: center" >Select a graph type</span>
        <select class = "uk-select" style = "text-align-last:center" id="graph" name="graph" @change = "onChange($event)">
            <option selected value="Pie" >Pie</option>
            <option value="Bar">Bar</option>
            <option value="Radar">Radar</option>
        </select>
        <!-- <BarChart /> -->
    <RadarChart v-if = "loaded && loadRadar" :chart-data="chartData" :chart-options="chartOptions" />
    <BarChart v-if = "loaded && loadBar" :chart-data="chartData" :chart-options="chartOptions" />
    <PieChart v-if = "loaded && loadPie" :chart-data="chartData" :chart-options="chartOptions" />

        <!-- <PolarArea v-if = "loaded" :chart-data="chartData" :chart-options="chartOptions" /> -->
    <h1 class="uk-heading-bullet"> Key Summary </h1>
    <ul class="uk-list uk-list-divider">
        <li>what</li>
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
        chartData: { labels:["dog"], datasets: ["3"] },
        owner_transactions: null,
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
    watch: {
        owner_transactions(new_transaction, old_transaction) {
            this.loaded = false
            var category_totals = {}
            console.log(this.owner_transactions)
            console.log(this.owner_transactions.length)
            for(let i = 0; i < this.owner_transactions.length; i++) {
                if(!Object.prototype.hasOwnProperty.call(category_totals,this.owner_transactions[i].category)) {
                    category_totals[this.owner_transactions[i].category] = this.owner_transactions[i].amount
                }   
                else {
                    category_totals[this.owner_transactions[i].category] += this.owner_transactions[i].amount
                }
            }
            this.chartData = {labels: Object.keys(category_totals), datasets: [{data: Object.values(category_totals), backgroundColor: ['lime', 'blue', 'yellow','aqua','orange',"rgba(255,99,132,1)" ], fill: true, label: "User summary", }]}
            console.log(this.chartData)
            this.loaded = true
            categories = Object.keys(category_totals)
            var len = categories.length
            categories.sort()
            var sortedCategories = [];
            for (let i = 0 ; i < len; i++) {
                let k = keys[i]
                sortedCategories.push({'key': k, 'value': dict[k]})
            }
            console.log(sortedCategories)
        },
    },
    firestore: function() {        
        return {
            spendingCategories: db.collection("spendingCategories").where('user', '==', auth.currentUser.uid),
            owner_transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid),
       
        }
    }


}
</script>

<style>

</style>