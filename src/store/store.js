import Vue from 'vue'
import Vuex from 'vuex'
import * as home from './modules/home'
import * as list from './modules/list'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		showingMenu: false
	},
	mutations: {
		SET_SHOWING_MENU(state) {
			state.showingMenu = !state.showingMenu
		}
	},
	actions: {
		setShowingMenu({ commit }) {
			commit('SET_SHOWING_MENU')
		}
	},
	modules: {
		home,
		list
	}
})
