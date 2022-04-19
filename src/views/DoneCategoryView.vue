<template>
  <div class="center">
    <h1> Completed Items </h1>
    <h4> Category: {{this.category}} </h4>
    <div v-if="categoryCompletedItems===false">
        <vk-spinner></vk-spinner>
    </div>
    <div v-else>
        <ul>
            <li class='done-list' v-for="item in categoryCompletedItems" :key="item.id"> 
                <div class="preview">&nbsp;{{item.description}}</div>
            </li>
        </ul>
        <br>
        <vk-button @click="$router.replace('/done')">Return to Completed Tasks</vk-button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    props:["category"],
    data: function() {
        return {
            categoryCompletedItems: false,
        }
    },
    firestore: function() {
        return {
            categoryCompletedItems: db.collection('todoItems').where('owner', '==', auth.currentUser.uid).where('done', '==', true).where('category', '==', this.category).orderBy('timestamp', 'desc')
        }
    },
    methods: {
    },
    beforeUpdate: function() {
        // called whenever the data is being updated.
        // if data is being updated from "false" to "null" -- the document wasn't found.
        // doesn't work for this webpage and bashing it out didn't fix anything...
        if (this.categoryCompletedItems.length==0) {
            this.$router.replace("/404")
        }
    },
}
</script>

<style>

</style>