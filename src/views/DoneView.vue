<template>
  <div class="center">
    <h1> Completed Tasks </h1>
    <div v-if="finishedItems===false">
        <vk-spinner></vk-spinner>
    </div>
    <div v-else>
        <h3 style="margin-bottom:0px"> Tasks </h3>
        <ul>
            <li class='done-list' v-for="item in finishedItems" :key="item.id"> 
                <div class="preview">&nbsp;{{item.description}}</div>
            </li>
        </ul>
        <br>
        <h3 style="margin-bottom:0px"> Categories </h3>
        <ul>
            <li v-for="category in categories" :key="category.id"> 
                <router-link :to="{name:'Category: Completed Tasks', params:{category:category.name}}" style="padding-right:1em">{{category.name}}</router-link>
            </li>
        </ul>
        <br>
        <vk-button @click="$router.push('todos')">Return to To-Do List</vk-button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    data: function() {
        return {
            finishedItems: false,
            categories: false
        }
    },
    firestore: function() {
        return {
            finishedItems: db.collection('todoItems').where('owner', '==', auth.currentUser.uid).where('done', '==', true).orderBy('timestamp', 'desc'),
            categories: db.collection('categories').where('owner', '==', auth.currentUser.uid).orderBy('name')
        }
    },
    methods: {
    }
}
</script>

<style>

</style>