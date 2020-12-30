export const namespaced = true

export const state = {
	lists: [],
	list:{}
}

export const mutations = {
	SET_LISTS(state, lists) {
		state.lists = lists
	},
	SET_LIST(state,list){
		state.list=list
	}
}

export const actions = {
	setLists({ commit }, lists) {
		commit('SET_LISTS', lists)
	},
	setList({commit},list){
		commit('SET_LIST',list)
	}
}