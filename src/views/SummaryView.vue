<template>
    <div>
    <label for="graph">Choose a graph type:</label>
        <select id="graph" name="graph">
            <option value="Pie">Pie</option>
            <option value="Bar">Bar</option>
            <option value="Chart">Chart</option>

        </select>
        <BarChart />
    </div>
    
</template>

<script>
import BarChart from '../components/BarChart.vue'
export default {
  name: 'App',
  components: { BarChart }
}
</script>

<style>

</style>