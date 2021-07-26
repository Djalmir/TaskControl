export const namespaced = true

export const state = {
	user: JSON.parse(localStorage.getItem('Razion.user')) || ''
}

export const mutations = {
	SET_USER(state, user) {
		state.user = user
		
		if(!user)
			localStorage.removeItem('Razion.user')
		else if(user!=localStorage.getItem('Razion.user'))
			localStorage.setItem('Razion.user', JSON.stringify(user))
	}
}

export const actions = {
	setUser({commit}, user) {
		commit('SET_USER', user)
	}
}