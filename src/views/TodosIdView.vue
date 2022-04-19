<template>
    <div class="center">
        <div v-if="itemData !== false && itemData !== null">
            <h2> Your Task Is: </h2>
            <vk-notification status="success" :messages.sync="messages">
                <div class="notification-text" slot-scope="{ message }">
                    <vk-icon icon="check"></vk-icon> {{ message }}
                </div>
            </vk-notification>
            <div v-if="!markedDone">
                <div>
                    <h4>Task Description:</h4>
                    <editable-div :text="itemData.description" @edited="updateDescription"/>
                </div>
                <br>
                <div>
                    <h4>Task Category:</h4>
                    <select class="form-control" v-model="selectedCategory" @change="updateCategory">
                        <option v-for="category in categories" :key="category.id">{{ category.name }}</option>
                    </select>
                </div>
                <br>
                <vk-button size="small" type="primary" @click="markDone(itemId)"> Mark Completed </vk-button>
            </div>
            <div v-else>
                {{itemData.description}}
            </div>
        </div>
        <span v-else >
            <vk-spinner></vk-spinner>
        </span>
        <br>
        <vk-button @click="$router.replace('/todos')">Return to To-Do List</vk-button>
    </div>
</template>

<script>

import { db, auth } from '@/firebaseConfig'
import EditableDiv from '@/components/EditableDiv.vue'

export default {
    components: { EditableDiv },
    name:"todosIdView",
    props:["itemId"],
    data:function(){
        return {
            itemData: false,
            markedDone: false,
            categories: false,
            selectedCategory: false,
            messages: []
        }
    },
    firestore: function() {
        return {
            itemData: db.collection("todoItems").doc(this.itemId),
            categories: db.collection('categories').where('owner', '==', auth.currentUser.uid).orderBy('name')
        }
    },
    methods: {
        markDone: function(itemId) {
            db.collection('todoItems').doc(itemId).update({
                done: true
            })
            this.markedDone = true
            this.messages.push({ message: 'Task Marked Completed', status: 'success', timeout: 3000 })
        },
        updateDescription: function(newDescription) {
            db.collection('todoItems').doc(this.itemId).update({
                description: newDescription
            })
            this.messages.push({ message: 'Task Description Updated Successfully', status: 'success', timeout: 3000 })
        },
        updateCategory: function() {
            db.collection('todoItems').doc(this.itemId).update({
                category: this.selectedCategory
            })
            this.messages.push({ message: 'Task Category Updated Successfully', status: 'success', timeout: 3000 })
        },
    },
    beforeUpdate: function() {
        // called whenever the data is being updated.
        // if data is being updated from "false" to "null" -- the document wasn't found.
        if (this.itemData === null) {
            this.$router.replace("/404")
        } else {
            this.selectedCategory = this.itemData.category
        }
    },
}
</script>

<style>

</style>