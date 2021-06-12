export const namespaced = true

export const state = {
	user: JSON.parse(localStorage.getItem('TaskControl-user')) || ''
}

export const mutations = {
	SET_USER(state, user) {
		state.user = user
		
		if(!user)
			localStorage.removeItem('TaskControl-user')
		else if(user!=localStorage.getItem('TaskControl-user'))
			localStorage.setItem('TaskControl-user', JSON.stringify(user))
	}
}

export const actions = {
	setUser({commit}, user) {
		commit('SET_USER', user)
	}
}