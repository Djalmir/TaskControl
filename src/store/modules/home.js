export const namespaced = true

export const state = {
	showingSubMenu: null,
	renaming: 0
}

export const mutations = {
	SET_SHOWING_SUB_MENU(state, showingSubMenu) {
		state.showingSubMenu = showingSubMenu
	}
}

export const actions = {
	setShowingSubMenu({ commit }, showingSubMenu) {
		commit('SET_SHOWING_SUB_MENU', showingSubMenu)
	}
}
