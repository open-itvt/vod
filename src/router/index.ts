import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LiveView from '../views/LiveView.vue'
import SearchView from '../views/SearchView.vue'
import VodView from '../views/VodView.vue'
import CategoryView from '../views/CategoryView.vue'
import AppsView from '../views/AppsView.vue'
import AppsOtherView from '../views/AppsOtherView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/live/:name', name: 'live', component: LiveView },
    { path: '/search', name: 'search', component: SearchView },
    { path: '/vod/:programName/:part', name: 'vod', component: VodView },
    { path: '/category/:slug', name: 'category', component: CategoryView },
    { path: '/apps', name: 'apps', component: AppsView },
    { path: '/apps/other', name: 'apps-other', component: AppsOtherView },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 25 }
    }
    return { top: 0 }
  },
})

export default router
