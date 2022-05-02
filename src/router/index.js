import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFoundView from '../views/NotFoundView'
import AddTransactionView from '../views/AddTransactionView'
import TransactionDetailView from '../views/TransactionDetailView'
import AllTransactionsView from '../views/AllTransactionsView'
import FilterResultsView from '../views/FilterResultsView.vue'
import OverviewView from '../views/OverviewView'
import BudgetView from '../views/BudgetView'
import BudgetCategoryView from '../views/BudgetCategoryView'
import SummaryView from '../views/SummaryView'
import GoogleMapView from '../views/GoogleMapView'
import {auth} from "@/firebaseConfig.js"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      hideNavbar: true
    },
    beforeEnter: (to, from, next) => {
      // reject the navigation
      if (auth.currentUser) {
        next('/overview')
      } else {
        next()
      }
    },
  },
  {
    path: '/overview',
    name: 'Overview',
    component: OverviewView,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/allTransactions',
    name: 'AllTransactions',
    component: AllTransactionsView,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/filterResults',
    name: 'FilterResults',
    component: FilterResultsView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/add-transaction',
    name: 'Add Transaction',
    component: AddTransactionView,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/transaction/:transactionId',
    name: 'Transaction Detail',
    component: TransactionDetailView,
    props:true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/monthlyBudget',
    name: 'Budget',
    component: BudgetView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/monthlyBudget/:category/:id',
    // path: '/monthlyBudget/:id',
    name: 'oneCategory',
    component: BudgetCategoryView,
    props: true,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/summary',
    name: 'Summary',
    component: SummaryView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/map',
    name: 'Map',
    component: GoogleMapView,
    props: true,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '*',
    name: '404',
    component: NotFoundView
  }
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  document.title = to.name;
  if (requiresAuth && !auth.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
