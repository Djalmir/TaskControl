import Axios from '../../services/Axios'
export const namespaced = true

export const state = {
	lists: [],
	list: {}
}

export const mutations = {
	SET_LISTS(state, lists) {
		state.lists = lists
	},
	SET_LIST(state, list) {
		state.list = list
	},
	SET_TODOS(state, todos) {
		state.list.todos = todos
	}
}

export const actions = {
	setLists({ commit }, lists) {
		commit('SET_LISTS', lists)
	},
	setList({ commit, getters }, id) {
		var list = getters.getListById(id)
		if (list) {
			commit('SET_LIST', list)
			return list
		} else {
			return Axios.getListById(id)
				.then(res => {
					commit('SET_LIST', res.data)
					return res.data
				})
				.catch(err => {
					console.log('erro:', err.response)
				})
		}
	},
	setTodos({ commit }, todos) {
		commit('SET_TODOS', todos)
	}
}

export const getters = {
	getListById: state => id => {
		return state.lists.find(list => list.id === Number(id))
	}
}
