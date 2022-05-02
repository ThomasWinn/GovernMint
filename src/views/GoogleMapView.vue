<template>
    <div class = "center">
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
                    :center='center'
                    :zoom='12'
                    style='width:500px;  height: 500px;'
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
                <h3> Transaction Details: </h3>
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

<script>
import { db, auth } from '@/firebaseConfig'
export default {
    name: 'GoogleMap',
    data() {
        return {
            center: { lat: 44.9778, lng: 93.2650 },
            currentPlace: null,
            currentMarker: null,
            markers: [],
            places: [],
            transactions: null
        }
    },
    firestore: function() {
        return {
            transactions: db.collection('transactions').where('owner', '==', auth.currentUser.uid).orderBy('date', 'desc')
        }
    },
    mounted() {
        this.geolocate();
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
    },
    // transform firebase transactions into something the google maps component can manage
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
        }
    }
};
</script>