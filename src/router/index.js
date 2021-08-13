import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import NotFound from '../views/NotFound.vue'

Vue.use(VueRouter)

/*
  1.)
  router redirects are not being used activley 
  all router pushes are made directly to the named routes
  never to the redirect path

  2.)
  ideally only one redirect should exist:
  if !loggedIn -> login page
  if loggedIn -> landing page (eg. /subscriptions) via middleware
  suggestion: vue-auth

  3.)
  {
    path: '/users',                                                                // http://localhost/users
    component: () => import('./components/UsersList.vue'),                         // used for listing all users
    children: [
      {
        path: 'create',                                                            // http://localhost/users/create
        component: () => import('./components/UsersCreate.vue'),                   // used for creating a user resource
      },
      {
        path: ':userId',                                                            // http://localhost/users/1
        component: () => import('./components/UsersRead.vue'),                      // used for reading a user resource
        children: [
          {
            path: 'update',                                                         // http://localhost/users/1/update
            component: () => import('./components/UserRead.vue'),                   // used for updating a user resource
          }
          {
            path: 'subscriptions',                                                 // http://localhost/users/1/subscriptions
            component: () => import('./components/UserSubscriptionsList.vue')      // used for listing a users subscription
          }
        ]
      },
    ]
  },

  4.)
  flat array of routes 
  pros: easier to grok, easier to write middleware for it
  cons: WET because meta fields need to be present on every route, not just the parent
*/

const routes = [
  {
      path: '/',
      redirect: '/users'           // should redirect to the desired landing page only if logged in
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/users',                     // http://localhost/users
    name: 'users index page',
    component: Home,                    // used for listing all users
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: 'create',                  // http://localhost/users/create
        name: 'users create page',       // 
        component: Home,                 // used for creating a user resource
      },
      {
        path: ':userId',                 // http://localhost/users/1
        component: Home,                 // used for reading a user resource
        children: [
          {
            path: 'update',              // http://localhost/users/1/update
            component: Home,             // used for updating a user resource
          },
          {
            path: 'subscriptions',       // http://localhost/users/1/subscriptions
            component: Home,             // used for listing all subscription resources that belong to the user
            children: [
              {
                path: ':subscriptionId', // http://localhost/users/1/subscriptions/5
                component: Home,          // used for reading a subscription resource that belongs to the user
                meta: {
                  someOtherFlag: true
                },
              }
            ]
          }
        ]
      },
    ]
  },
  {
    path: '*',
    component: NotFound
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

const isLoggedIn = false
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!isLoggedIn) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
