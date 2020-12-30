import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import store from '../store/store'
import * as home from '../store/modules/home'
import * as list from '../store/modules/list'
import Axios from "../services/Axios"

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/list/:id',
		name: 'List',
		component: List,
		props:true,
		beforeEnter(to, from, next){
			store.dispatch('list/setList',to.params.id)
				.then(()=>{
					console.log('show',list.name)
					next()
				})
		}
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	let showingMenu = store.state.showingMenu
	let renaming = home.state.renaming
	if (showingMenu) store.dispatch('setShowingMenu')
	if (renaming) next(false)
	else next()
})

export default router
