import Vue from 'vue'
import Vuex from 'vuex'
import * as list from './modules/list'

Vue.use(Vuex)
// import Axios from '../services/Axios'
export default new Vuex.Store({
	state: {
		showingMenu: false,
		showingSubMenu: null,
		renaming: undefined
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
		}
	},
	actions: {
		setShowingMenu({ commit }) {
			commit('SET_SHOWING_MENU')
		},
		setShowingSubMenu({ commit }, showingSubMenu) {
			commit('SET_SHOWING_SUB_MENU', showingSubMenu)
		},
		setRenaming({ commit }, renaming) {
			commit('SET_RENAMING', renaming)
		}
	},
	modules: {
		list
	}
})