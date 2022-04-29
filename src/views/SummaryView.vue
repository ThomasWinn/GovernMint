<template>
    <div>
    <label for="graph">Choose a graph type:</label>
        <select id="graph" name="graph">
            <option value="Pie">Pie</option>
            <option value="Bar">Bar</option>
            <option value="Chart">Chart</option>

        </select>
        <!-- <BarChart /> -->
        <PieChart v-if = "loaded" :chart-data="chartData" :chart-options="chartOptions" />
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

export default {
    name: 'App',
    components: { PieChart },
        data: () => ({
        loaded: false,
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
            this.chartData = {labels: Object.keys(category_totals), datasets: [{data: Object.values(category_totals), backgroundColor: ['red', 'blue', 'yellow','aqua','lime',"orange" ] }]}
            console.log(this.chartData)
            this.loaded = true
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