import Vue from 'vue'
import Router from 'vue-router'
import Resource from 'vue-resource'
import App from './App'
import VeeValidate from 'vee-validate'

// Require Froala Editor js file.
require('froala-editor/js/froala_editor.pkgd.min')

// Require Froala Editor css files.
require('froala-editor/css/froala_editor.pkgd.min.css')
require('font-awesome/css/font-awesome.css')
require('froala-editor/css/froala_style.min.css')

// Import and use Vue Froala lib.
import VueFroala from 'vue-froala-wysiwyg'

import 'vue-croppa/dist/vue-croppa.css'
import Croppa from 'vue-croppa'

import './stylus/main.styl'
import Vuetify from 'vuetify'

import Modal from 'vuejs-modal'
import confirm from 'vuejs-modal/lib/confirm.vue'

// Import components
import VConfirm from './components/directives/Confirmation.vue'
import VFeaturedImage from './components/directives/FeaturedImage.vue'

import Login from './components/pages/Login.vue'
import Modules from './components/pages/Modules.vue'
import Permissions from './components/pages/Permissions.vue'
import Roles from './components/pages/Roles.vue'
import Users from './components/pages/Users.vue'
import Profile from './components/pages/Profile.vue'
import Posts from './components/pages/Posts.vue'
import Categories from './components/pages/Categories.vue'
import Tags from './components/pages/Tags.vue'

import froala from './froala'
import auth from './auth'
auth.checkAuth()
Vue.use(Vuetify)
Vue.use(VeeValidate)
Vue.use(Resource)
Vue.use(Router)

Vue.use(Modal, {
  name: '$modal',
  id: 'modal',
  modals: {
    confirm: VConfirm,
    setFeaturedImage: VFeaturedImage
  },
  style: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(58, 58, 58, 0.5)'
  }
})

Vue.use(VueFroala)
Vue.use(Croppa)

// Routes
export var router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'modules', component: Modules, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: Login, meta: { checksAuth: true } },
    { path: '/permissions', name: 'permissions', component: Permissions, meta: { requiresAuth: true } },
    { path: '/roles', name: 'roles', component: Roles, meta: { requiresAuth: true } },
    { path: '/users', name: 'users', component: Users, meta: { requiresAuth: true } },
    { path: '/posts', name: 'posts', component: Posts, meta: { requiresAuth: true } },
    { path: '/posts/categories', name: 'categories', component: Categories, meta: { requiresAuth: true } },
    { path: '/posts/tags', name: 'tags', component: Tags, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: Profile, meta: { requiresAuth: true } }
  ]
})

Vue.http.options.root = process.env.API_URL
Vue.http.headers.common['Accept'] = 'application/json'

window._ = require('lodash')
if (localStorage.getItem('token')) {
  Vue.http.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token')

  froala.config.requestHeaders = {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth.user.authenticated) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  }

  if (to.matched.some(record => record.meta.checksAuth)) {
    if (auth.user.authenticated) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

//Build app into #app div
const app = new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
