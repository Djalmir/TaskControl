import Vue from 'vue'
import Vuex from 'vuex'
import * as home from './modules/home'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		showingMenu: false,
		lists: []
	},
	mutations: {
		SET_SHOWING_MENU(state) {
			state.showingMenu = !state.showingMenu
		},
		SET_LISTS(state, lists) {
			state.lists = lists
		}
	},
	actions: {
		setShowingMenu({ commit }) {
			commit('SET_SHOWING_MENU')
		},
		setLists({ commit }, lists) {
			commit('SET_LISTS', lists)
		}
	},
	modules: {
		home
	}
})
