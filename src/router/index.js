import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TodosView from '../views/TodosView'
import TodosIdView from '../views/TodosIdView'
import TodosCategoryView from '../views/TodosCategoryView'
import DoneView from '../views/DoneView'
import DoneCategoryView from '../views/DoneCategoryView'
import NotFoundView from '../views/NotFoundView'
import AddTransactionView from '../views/AddTransactionView'
import {auth} from "@/firebaseConfig.js"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    beforeEnter: (to, from, next) => {
      // reject the navigation
      if (auth.currentUser) {
        next('/todos')
      } else {
        next()
      }
    },
  },
  {
    path: '/todos',
    name: 'Tasks',
    component: TodosView,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/todos/:itemId',
    name: 'Task View',
    component: TodosIdView,
    props:true,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/todos/:category',
    name: 'Category: Tasks',
    component: TodosCategoryView,
    props:true,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/done',
    name: 'Completed Tasks',
    component: DoneView,
    props:true,
    meta: { 
          requiresAuth: true
    },
  },
  {
    path: '/done/:category',
    name: 'Category: Completed Tasks',
    component: DoneCategoryView,
    props:true,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '/addTransaction',
    name: 'Add Transaction',
    component: AddTransactionView,
    meta: { 
      requiresAuth: true
    },
  },
  {
    path: '*',
    name: '404',
    component: NotFoundView
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   meta: { // connects with the function later in this file.
  //     requiresAuth: true
  //   },
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: AboutView
  // }
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
