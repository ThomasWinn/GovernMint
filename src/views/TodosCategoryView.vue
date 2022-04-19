<template>
  <div class="center">
    <h1> To-Do List </h1>
    <h4> Category: {{this.category}} </h4>
    <div v-if="categoryTodoItems===false">
        <vk-spinner></vk-spinner>
    </div>
    <div v-else>
        <ul>
            <li v-for="item in categoryTodoItems" :key="item.id"> 
                <div class="preview"> 
                    <router-link :to="{name:'Task View', params:{itemId:item.id}}">
                        <span style="padding-left:1em">{{item.description}}</span>
                    </router-link>
                </div>
            </li>
        </ul>
        <br>
        <vk-button @click="$router.replace('/todos')">Return to To-Do List</vk-button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    props:["category"],
    data: function() {
        return {
            categoryTodoItems: false,
        }
    },
    firestore: function() {
        return {
            categoryTodoItems: db.collection('todoItems').where('owner', '==', auth.currentUser.uid).where('done', '==', false).where('category', '==', this.category).orderBy('timestamp', 'desc')
        }
    },
    methods: {
    },
    beforeUpdate: function() {
        // called whenever the data is being updated.
        // if data is being updated from "false" to "null" -- the document wasn't found.
        if (this.categoryTodoItems === null || this.categoryTodoItems === []) {
            this.$router.replace("/404")
        }
        
    },
}
</script>

<style>

</style>