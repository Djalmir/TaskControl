import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Signup from '../views/Signup'
import Home from '../views/Home.vue'
import List from '../views/List.vue'
import store from '../store/store'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Login',
		component: Login
	},
	{
		path: '/signup',
		name: 'Signup',
		component: Signup
	},
	{
		path: '/home',
		name: 'Home',
		component: Home,
		beforeEnter(to, from, next) {
			if(store.state.session.user)
				next()
			else
				next('/')
		}
	},
	{
		path: '/list/:id',
		name: 'List',
		component: List,
		props: true,
		beforeEnter(to, from, next) {
			if(store.state.session.user){
				store.dispatch('list/setList', to.params.id).then(list => {
					to.params.list = list
					next()
				})
			}
			else
				next('/')
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

router.beforeEach((to, from, next) => {
	let showingMenu = store.state.showingMenu
	let renaming = store.state.renaming
	if (showingMenu) store.dispatch('setShowingMenu')
	if (renaming) next(false)
	else next()
})

export default router
