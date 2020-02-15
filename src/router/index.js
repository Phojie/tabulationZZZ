import Vue from 'vue'
import VueRouter from 'vue-router'
import { firebaseAuth } from 'boot/firebase'
import routes from './routes'
Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

const Router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
  // Leave these as they are and change in quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

Router.beforeEach((to, from, next) => {
  // Check to see if the route has the meta field "authRequired" set to true
  const authRequired = to.matched.some(route => route.meta.authRequired)
  if (authRequired) {
    firebaseAuth.onAuthStateChanged(user => {
      if (user) {
      // User is already signed in. Continue on.
        next()
      } else {
      // Not signed in. Redirect to login page.
        next({
          name: 'login'
        })
      }
    })
  } else {
    // Doesn't require authentication. Just continue on.
    next()
  }
})

export default Router