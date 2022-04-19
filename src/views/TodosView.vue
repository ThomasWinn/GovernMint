<template>
  <div class="center">
    <h1> To-Do List </h1>
    <div v-if="todos===false">
        <vk-spinner></vk-spinner>
    </div>
    <div v-else>
        <vk-notification :messages.sync="messages">
            <div class="notification-text" slot-scope="{ message }">
                {{ message }}
            </div>
        </vk-notification>
        <h3 style="margin-bottom:0px"> Tasks </h3>
        <ul>
            <li v-for="item in todos" :key="item.id"> 
                <div class="preview"> 
                    <vk-button size='small' @click="markDone(item.id)"> Mark Completed </vk-button>
                    <router-link :to="{name:'Task View', params:{itemId:item.id}}">
                        <span style="padding-left:1em">{{item.description}}</span>
                    </router-link>
                </div>
            </li>
        </ul>
        <br>
        <textarea
            placeholder="add new task"
            v-model="newTodo"
            @keyup.enter="addItem"
        ></textarea>
        <br>
        <vk-button type="primary" @click="addItem">Add Task</vk-button>
        <br>
        <h3 style="margin-bottom:0px"> Categories </h3>
        <ul>
            <li v-for="category in categories" :key="category.id"> 
                <router-link :to="{name:'Category: Tasks', params:{category:category.name}}" style="padding-right:1em">{{category.name}}</router-link>
                <vk-button size='small' type='danger' @click="deleteCategory(category.id)">Delete Category</vk-button>
            </li>
        </ul>
        <br>
        <input style="margin-bottom:0.5em" placeholder="add new category" v-model="newCategory" @keyup.enter="addCategory" />
        <br>
        <vk-button type="primary" @click="addCategory">Add Category</vk-button>
        <br><br>
        <vk-button @click="$router.push('done')">View Completed Items</vk-button>
    </div>
  </div>
</template>

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    data: function() {
        return {
            todos: false,
            categories: false,
            newTodo: "",
            newCategory: "",
            messages: []
        }
    },
    firestore: function() {
        return {
            todos: db.collection('todoItems').where('owner', '==', auth.currentUser.uid).where('done', '==', false).orderBy('timestamp', 'desc'),
            categories: db.collection('categories').where('owner', '==', auth.currentUser.uid).orderBy('name')
        }
    },
    methods: {
        addItem: function() {
            this.newTodo = this.newTodo.trim()
            if (this.newTodo.length > 0) {
                console.log({
                    description: this.newTodo,
                    done: false,
                    category: null,
                    timestamp: new Date(),
                    owner: auth.currentUser.uid
                })
                db.collection('todoItems').add({
                    description: this.newTodo,
                    done: false,
                    category: 'No Category',
                    timestamp: new Date(),
                    owner: auth.currentUser.uid
                })
                this.messages.push({ message: 'Task Successfully Added', status: 'success', timeout: 3000 })
            } else {
                this.messages.push({ message: 'Cannot Add Empty Task', status: 'danger', timeout: 3000 })
            }
            this.newTodo = ""    
        },
        markDone: function(itemId) {
            db.collection('todoItems').doc(itemId).update({
                done: true
            })
            this.messages.push({ message: 'Task Marked Completed', status: 'success', timeout: 3000 })
        },
        addCategory: function() {
            this.newCategory = this.newCategory.trim()
            if (this.newCategory.length > 0) {
                console.log({
                    name: this.newCategory,
                    owner: auth.currentUser.uid
                })
                db.collection('categories').add({
                    name: this.newCategory,
                    owner: auth.currentUser.uid
                })
                this.messages.push({ message: 'Category Successfully Added', status: 'success', timeout: 3000 })
            } else {
                this.messages.push({ message: 'Cannot Add Empty Category', status: 'danger', timeout: 3000 })
            }
            this.newCategory = ""    
        },
        deleteCategory: function(categoryId) {
            db.collection("categories").doc(categoryId).delete().then(() => {
                this.messages.push({ message: 'Category Successfully Deleted', status: 'success', timeout: 3000 })
            }).catch((error) => {
                console.error("Error removing document: ", error);
            });
        }
    }
}
</script>

<style>

</style>