import Vue from 'vue'
import Vuex from 'vuex'
import * as list from './modules/list'

Vue.use(Vuex)
import Axios from '../services/Axios'
export default new Vuex.Store({
	state: {
		showingMenu: false,
		showingSubMenu: null,
		renaming: 0
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
		},
		delOrCancel({ state, commit, dispatch }, item) {
			if (state.renaming) commit('SET_RENAMING', null)
			else {
				if (confirm(`Remover a lista ${item.name}?`)) {
					Axios.deleteList(item.id)
						.then(() => {
							let items = list.lists.filter(l => l.id != item.id)
							dispatch('list/setLists', items, { root: true })
						})
						.catch(err => {
							console.log(err)
						})
				}
			}
		},
		renameOrSave({ state, commit, dispatch }, item) {
			if (state.renaming) {
				let input = document.querySelector(`#nameInput${item.id}`)
				if (input.value.trim() != '') {
					Axios.putList(item.id, input.value, item.todos)
						.then(() => {
							item.name = input.value
							dispatch('list/setLists', list.lists)
							commit('SET_RENAMING', null)
							commit('SET_SHOWING_SUB_MENU', null)
						})
						.catch(err => {
							console.log(err)
						})
				} else input.focus()
			} else {
				commit('SET_RENAMING', item.id)
				setTimeout(() => {
					let input = document.querySelector(`#nameInput${item.id}`)
					input.focus()
				}, 200)
			}
		}
	},
	modules: {
		list
	}
})
