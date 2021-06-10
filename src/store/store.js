import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/router'
import * as session from './modules/session'
import * as list from './modules/list'

Vue.use(Vuex)
// import Axios from '../services/Axios'
export default new Vuex.Store({
	state: {
		showingMenu: false,
		showingSubMenu: null,
		renaming: undefined,
		loading: false,
		currentPath: '/'
	},
	mutations: {
		SET_SHOWING_MENU(state) {
			state.showingMenu = !state.showingMenu
		},
		SET_SHOWING_SUB_MENU(state, showingSubMenu) {
			state.showingSubMenu = showingSubMenu
		},
		SET_RENAMING(state, renaming) {
			state.renaming = renaming
		},
		SET_LOADING(state, loading) {
			state.loading = loading
		},
		SET_CURRENT_PATH(state, dir){
			state.currentPath = dir
		}
	},
	actions: {
		setShowingMenu({commit}) {
			commit('SET_SHOWING_MENU')
		},
		setShowingSubMenu({commit}, showingSubMenu) {
			commit('SET_SHOWING_SUB_MENU', showingSubMenu)
		},
		setRenaming({commit}, renaming) {
			commit('SET_RENAMING', renaming)
		},
		setLoading({commit}, loading) {
			commit('SET_LOADING', loading)
		},
		goTo({state, commit}, dir) {
			if (state.currentPath != dir) {
				commit('SET_CURRENT_PATH', dir)
				router.push(`${ dir }`)
			}
		}
	},
	modules: {
		session,
		list
	}
})